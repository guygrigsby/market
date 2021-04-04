package cloudfuncs

import (
	"context"
	"encoding/json"
	"io"
	"net/http"

	"cloud.google.com/go/firestore"
	"github.com/getlantern/deepcopy"
	"github.com/guygrigsby/market/functions/store"
	"github.com/guygrigsby/mtgfail"
	"github.com/guygrigsby/mtgfail/tabletopsimulator"
	"github.com/inconshreveable/log15"
)

func CreateAllFormatsLocal(w http.ResponseWriter, r *http.Request) {
	r.Header.Set("testing", "true")
	CreateAllFormats(w, r)
}

// CreateAllFormats makes both internal and tts formats decks
func CreateAllFormats(w http.ResponseWriter, r *http.Request) {

	log := log15.New()

	log.Debug("created Handler")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Add("Access-Control-Allow-Methods", "GET")
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Add("Access-Control-Allow-Headers", "Accept-Encoding")
	w.Header().Set("Access-Control-Max-Age", "3600")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		log.Debug("CORS preflight")
		return
	}
	ctx := context.Background()
	var (
		rc   io.ReadCloser
		err  error
		site mtgfail.DeckSite = -1
	)
	hasBodyDeck := r.URL.Query().Get("decklist") != ""

	if hasBodyDeck {
		log.Debug("decklist sent")
		rc = r.Body
	} else {
		uri := r.URL.Query().Get("deck")
		log.Debug(
			"no decklist",
			"value", hasBodyDeck,
			"uri", uri,
		)

		site, rc, err = FetchDeck(uri, log)
		if err != nil {
			log.Error(
				"failed to fetch deck",
				"err", err,
			)
			http.Error(w, "cannot read decklist", http.StatusBadGateway)
			return
		}
		log.Debug("fetched deck")
	}
	deckList, err := mtgfail.Normalize(site, rc, log)
	if err != nil {
		msg := "cannot fetch deck"
		log.Error(
			"can't read cards",
			"err", err,
		)
		http.Error(w, msg, http.StatusBadRequest)
		return
	}
	log.Debug(
		"parsed deck",
		"count", len(deckList),
		"decklist", deckList,
	)
	testing := r.Header.Get("testing")

	var client *firestore.Client
	if testing != "" {
		client, err = firestore.NewClient(
			ctx,
			"test",
		)
	} else {
		client, err = firestore.NewClient(
			ctx,
			"marketplace-c87d0",
		)
	}
	if err != nil {
		log.Error(
			"Failed to get firestore client",
			"err", err,
		)
		http.Error(w, "failed to get firestore client", http.StatusInternalServerError)
		return
	}
	store := store.NewFirestore(client, log)
	ret := &DualDeck{}
	var names []string
	for name := range deckList {
		names = append(names, name)

	}
	log.Debug(
		"collated card names",
		"count", len(names),
		"names", names,
	)
	entries, errs := store.GetMany(names, log)
	if len(errs) > 0 {
		log.Warn(
			"Errors occurred while getting cards from store",
			"errs", errs,
		)
		ret.Errors = errs
	}

	log.Debug("starting TTS build")
	ttsDeck, err := BuildTTS(ctx, deckList, entries, log)
	if err != nil {
		log.Error(
			"Failed to build TTS deck",
			"err", err,
		)
		return
	}
	log.Debug(
		"TTS build done",
		"contents", ttsDeck,
	)
	ret.TTS = ttsDeck
	mults, err := genDups(entries, deckList, log)
	if err != nil {
		msg := "cannot create copies for card multiples"
		log.Error(
			msg,
			"err", err,
		)
		http.Error(w, msg, http.StatusInternalServerError)
		return
	}
	ret.Intern = mults

	b, err := json.Marshal(ret)
	if err != nil {

		log.Error(
			"Can't marshal deckfile",
			"err", err,
		)
		return

	}

	w.Header().Add("Content-Type", "application/json")

	_, err = w.Write(b)
	if err != nil {
		log.Error(
			"Can't write dual deckfile",
			"err", err,
		)
		return

	}
	w.Header().Set("Access-Control-Allow-Origin", "*")

}
func genDups(entries []*mtgfail.Entry, dl map[string]int, log log15.Logger) ([]*mtgfail.Entry, error) {
	var news []*mtgfail.Entry
	for _, entry := range entries {
		if count, ok := dl[entry.Name]; ok {
			for i := 1; i < count; i++ {
				var newEntry mtgfail.Entry
				err := deepcopy.Copy(&newEntry, entry)
				if err != nil {
					log.Error(
						"cannot copy duplicate card",
						"card", entry.Name,
						"err", err,
					)
					return nil, err
				}
				news = append(news, &newEntry)
			}

		}
	}
	return append(news, entries...), nil
}
func cardCount(deck map[string]int) int {
	var count int
	for _, v := range deck {
		count += v
	}
	return count
}

type DualDeck struct {
	TTS    *tabletopsimulator.DeckFile `json:"tts,omitempty"`
	Intern []*mtgfail.Entry            `json:"internal,omitempty"`
	Errors []error                     `json:"errors,omitempty"`
}

func keySet(m map[string]int) []string {
	var s []string
	for k := range m {
		s = append(s, k)
	}
	return s
}
