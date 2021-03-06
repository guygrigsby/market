package cloudfuncs

import (
	"context"
	"encoding/json"
	"io"
	"io/ioutil"
	"net/http"
	"regexp"
	"strings"
	"sync"
	"time"

	"cloud.google.com/go/firestore"

	"github.com/guygrigsby/market/functions/store"
	"github.com/guygrigsby/mtgfail"
	"github.com/inconshreveable/log15"
)

func SyncCards(ctx context.Context, _ store.PubSubMessage) error {

	log := log15.New()
	res, err := http.DefaultClient.Get("https://c2.scryfall.com/file/scryfall-bulk/default-cards/default-cards-20201110220438.json")
	if err != nil {
		log.Error(
			"get cards failed",
			"err", err,
		)
		return err
	}
	defer res.Body.Close()

	cards, err := parse(res.Body, log)
	if err != nil {
		log.Error(
			"parse cards failed",
			"err", err,
		)
		return err
	}

	client, err := firestore.NewClient(ctx, "marketplace-c87d0")
	if err != nil {
		log.Error(
			"cannot connect to firestore",
			"err", err,
		)
		return err
	}
	err = upload(context.Background(), 100, client, cards, log)
	if err != nil {
		log.Error(
			"failed to upload",
			"err", err,
		)
		return err
	}
	return nil

}
func upload(ctx context.Context, cc int, client *firestore.Client, bulk map[string]*mtgfail.Entry, log log15.Logger) error {

	var wg sync.WaitGroup
	ch := make(chan *mtgfail.Entry, len(bulk))
	done := make(chan struct{})
	go func() {
		for _, card := range bulk {

			ch <- card
		}
		close(ch)
		wg.Wait()

		done <- struct{}{}
	}()
	cards := client.Collection("cards")
	for i := 0; i < cc; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for card := range ch {
				var wg sync.WaitGroup
				if strings.Contains(card.Name, "//") {
					wg.Add(1)
					go func(card *mtgfail.Entry) {
						defer wg.Done()
						re := regexp.MustCompile(`//.*`)
						// Strip everything after the double slash
						// Scryfall has the // , but some other places do not
						n := string(re.ReplaceAll([]byte(card.Name), []byte{}))
						key := store.CardKey(n, log)

						doc := cards.Doc(key)
						_, err := doc.Set(ctx, &card)
						if err != nil {
							log.Error(
								"Cannot create secondary named card in indexed collection",
								"name", card.Name,
								"err", err,
							)
						}
					}(card)

				}
				wg.Add(1)
				go func(card *mtgfail.Entry) {
					defer wg.Done()
					key := store.CardKey(card.Name, log)

					doc := cards.Doc(key)
					_, err := doc.Set(ctx, &card)
					if err != nil {
						log.Error(
							"Cannot create card in indexed collection",
							"name", card.Name,
							"err", err,
						)
					}
				}(card)

			}
			wg.Wait()
		}()
	}
	select {
	case <-ctx.Done():
		return ctx.Err()
	case <-done:

	}
	return nil
}

func parse(r io.Reader, log log15.Logger) (map[string]*mtgfail.Entry, error) {
	b, err := ioutil.ReadAll(r)
	if err != nil {
		log.Error(
			"Can't read file",
			"err", err,
		)
		return nil, err
	}

	var cards []*mtgfail.Entry
	err = json.Unmarshal(b, &cards)
	if err != nil {
		log.Error(
			"Can't unmarshal data",
			"err", err,
		)
		return nil, err
	}
	var bulk = make(map[string]*mtgfail.Entry)
	for i, card := range cards {
		if card == nil {
			log.Warn(
				"nil entry skipping",
				"index", i,
			)
			continue
		}
		lang := card.Lang
		switch lang {
		case "px": // Phyrexian
			fallthrough
		case "en":
			if entry, ok := bulk[card.Name]; ok { // already exists. Pick the better version.
				if !prettierCard(card, entry) {
					continue
				}

			}
			// it's gross, but scryfall adds the time of download as a param at the end and tts no likey
			card.ImageUris.Small = strings.Split(card.ImageUris.Small, "?")[0]
			card.ImageUris.Normal = strings.Split(card.ImageUris.Normal, "?")[0]
			card.ImageUris.Large = strings.Split(card.ImageUris.Large, "?")[0]
			card.ImageUris.Png = strings.Split(card.ImageUris.Png, "?")[0]
			bulk[card.Name] = card
		default:
			continue
		}

	}
	return bulk, nil
}

const (
	releaseDateFormat = "2006-01-02" //  reference time Mon Jan 2 15:04:05 -0700 MST 2006
)

// prettierCard compares entry against card to determine if entry is prettier than card.
// Essentially the first argument `card` is considered to be better unless certain criteria are met
// Assumptions in order
// Card must be in English
// black bordered cards are prettier
// alpha and beta cards are the prettiest
// full art is prettier than non-full art regardless of release
// newer is prettier
//
func prettierCard(existing, entry *mtgfail.Entry) bool {
	if entry.Lang != "en" {
		return false
	}
	if entry.BorderColor != "black" {
		return false
	}
	if existing.FullArt {
		return false
	}

	if entry.SetName == "alpha" || entry.SetName == "beta" {
		return true
	}
	if entry.FullArt {
		return true
	}
	cardRelease, err := time.Parse(releaseDateFormat, entry.ReleasedAt)
	if err == nil {
		entryRelease, err := time.Parse(releaseDateFormat, entry.ReleasedAt)
		if err == nil {
			if entryRelease.After(cardRelease) && entry.BorderColor == "black" {
				return true
			}
		}
	}
	return false
}
