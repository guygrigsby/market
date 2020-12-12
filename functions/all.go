package cloudfuncs

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"cloud.google.com/go/firestore"
	"github.com/guygrigsby/market/functions/store"
	"github.com/guygrigsby/mtgfail"
	"github.com/guygrigsby/mtgfail/tabletopsimulator"
	"github.com/inconshreveable/log15"
	"golang.org/x/sync/errgroup"
)

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

	uri := r.URL.Query().Get("deck")

	rc, err := FetchDeck(uri, log)
	if err != nil {
		log.Error(
			"failed to fetch deck",
			"err", err,
		)
		http.Error(w, "cannot read decklist", http.StatusBadGateway)
		return
	}
	log.Debug("fetched deck")

	deckList, err := mtgfail.ReadCardList(rc, log)
	if err != nil {
		msg := "cannot fetch deck"
		log.Error(
			"can't read cards",
			"err", err,
		)
		http.Error(w, msg, http.StatusBadGateway)
		return
	}
	log.Debug("parsed deck")
	client, err := firestore.NewClient(ctx, "snackend")
	if err != nil {
		log.Error(
			"Failed to get firestore client",
			"err", err,
		)
		http.Error(w, "failed to get firestore client", http.StatusBadGateway)
		return
	}
	store := store.NewFirestore(client, log)
	ret := &DualDeck{}
	g, ctx := errgroup.WithContext(ctx)
	g.Go(func() error {
		log.Debug("starting TTS build")
		ttsDeck, err := BuildTTS(ctx, store, deckList, log)
		if err != nil {
			return err
		}
		ret.TTS = ttsDeck
		log.Debug("TTS build done", "deck", ttsDeck)
		return nil
	})
	g.Go(func() error {
		log.Debug("starting internal build")
		internDeck, err := BuildInternal(ctx, store, deckList, log)
		if err != nil {
			return err
		}
		ret.Intern = internDeck
		log.Debug("internal build done", "deck", internDeck)
		return nil
	})
	if err := g.Wait(); err != nil {
		log.Error(
			"Cannot build decks",
			"err", err,
		)

		http.Error(w, fmt.Sprintf("failed to build deck %v", err), http.StatusInternalServerError)
		return
	}
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
}

func keySet(m map[string]int) []string {
	var s []string
	for k := range m {
		s = append(s, k)
	}
	return s
}
