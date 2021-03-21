package cloudfuncs

import (
	"context"
	"encoding/json"
	"io"
	"net/http"

	"cloud.google.com/go/firestore"
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
		rc  io.ReadCloser
		err error
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

		rc, err = FetchDeck(uri, log)
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
	deckList, err := mtgfail.ReadCardList(rc, log)
	if err != nil {
		msg := "cannot fetch deck"
		log.Error(
			"can't read cards",
			"err", err,
		)
		http.Error(w, msg, http.StatusBadRequest)
		return
	}
	log.Debug("parsed deck")
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
	names := make([]string, len(deckList))
	counts := make([]int, len(deckList))
	var i int
	for name, count := range deckList {
		names[i] = name
		counts[i] = count
		i++

	}
	entries, errs := store.GetMany(names, log)
	if len(errs) > 0 {
		log.Warn(
			"Errors ocurred while getting cards from store",
			"errs", errs,
		)
		ret.Errors = errs
	}
	ret.Intern = entries

	log.Debug("starting TTS build")
	ttsDeck, err := BuildTTS(ctx, deckList, entries, log)
	if err != nil {
		log.Error(
			"Failed to build TTS deck",
			"err", err,
		)
		return
	}
	ret.TTS = ttsDeck

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
