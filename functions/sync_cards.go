package cloudfuncs

import (
	"context"
	"encoding/json"
	"errors"
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

func SyncCardsHTTP(w http.ResponseWriter, r *http.Request) {
	log := log15.New()
	err := SyncCards(r.Context(), store.PubSubMessage{})
	if err != nil {
		log.Error(
			"Failed to sync cards",
			"err", err,
		)
		http.Error(w, "failed to sync", http.StatusInternalServerError)
	}
}
func SyncCards(ctx context.Context, _ store.PubSubMessage) error {
	start := time.Now()

	log := log15.New()
	log.Debug("starting", "time", start)
	bulkRes, err := http.DefaultClient.Get("https://api.scryfall.com/bulk-data")
	if err != nil {
		log.Error(
			"failed to get scryfall bulk cards",
			"err", err,
		)
		return err
	}
	log.Debug(
		"Got bulk urls",
		"time", time.Since(start),
	)
	defer bulkRes.Body.Close()
	b, err := ioutil.ReadAll(bulkRes.Body)
	if err != nil {
		log.Error(
			"failed to read scryfall bulk cards",
			"err", err,
		)
		return err
	}
	log.Debug(
		"Got cards. Unmarshaling ",
		"time", time.Since(start),
	)
	var bulk Bulk
	err = json.Unmarshal(b, &bulk)
	if err != nil {
		log.Error(
			"failed to unmarshal scryfall bulk cards",
			"err", err,
		)
		return err
	}
	var defaultCardsURL string
	for _, collection := range bulk.Data {
		if collection.Type == defaultCards {
			defaultCardsURL = collection.DownloadURI
		}
	}
	log.Debug(
		"Go most recent bulk URL",
		"URL", defaultCardsURL,
		"time", time.Since(start),
	)
	if defaultCardsURL == "" {
		log.Error(
			"Unable to get default cards URL",
		)
		return errors.New("Blank bulk cards URI")
	}

	res, err := http.DefaultClient.Get(defaultCardsURL)
	if err != nil {
		log.Error(
			"get cards failed",
			"err", err,
		)
		return err
	}
	defer res.Body.Close()
	log.Debug(
		"Made call to retrieve all cards",
		"time", time.Since(start),
	)
	cards, err := parse(res.Body, log)
	if err != nil {
		log.Error(
			"parse cards failed",
			"err", err,
		)
		return err
	}
	log.Debug(
		"Finished parsing cards",
		"time", time.Since(start),
	)

	client, err := firestore.NewClient(ctx, "marketplace-c87d0")
	if err != nil {
		log.Error(
			"cannot connect to firestore",
			"err", err,
		)
		return err
	}
	log.Debug(
		"Starting upload",
		"time", time.Since(start),
	)
	ctx, cancel := context.WithTimeout(ctx, time.Second*500)
	defer cancel()
	err = upload(ctx, 1000, client, cards, log)
	if err != nil {
		log.Error(
			"failed to upload",
			"err", err,
		)
		return err
	}
	log.Debug(
		"Finished upload",
		"time", time.Since(start),
	)
	return nil

}
func upload(ctx context.Context, cc int, client *firestore.Client, bulk map[string]*mtgfail.Entry, log log15.Logger) error {

	var wg sync.WaitGroup
	ch := make(chan *mtgfail.Entry, len(bulk))
	done := make(chan struct{})
	cardCount := 0
	go func() {
		for _, card := range bulk {

			ch <- card
			cardCount++
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
				log.Debug(
					"uploaded card",
					"name", card.Name,
					"key", key,
				)

			}
		}()
	}
	select {
	case <-ctx.Done():
		return ctx.Err()
	case <-done:
		log.Info(
			"Uploaded Cards",
			"count", cardCount,
		)
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
	defaultCards      = "default_cards"
)

type Bulk struct {
	Object  string `json:"object"`
	HasMore bool   `json:"has_more"`
	Data    []struct {
		Object          string    `json:"object"`
		ID              string    `json:"id"`
		Type            string    `json:"type"`
		UpdatedAt       time.Time `json:"updated_at"`
		URI             string    `json:"uri"`
		Name            string    `json:"name"`
		Description     string    `json:"description"`
		CompressedSize  int       `json:"compressed_size"`
		DownloadURI     string    `json:"download_uri"`
		ContentType     string    `json:"content_type"`
		ContentEncoding string    `json:"content_encoding"`
	} `json:"data"`
}

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
