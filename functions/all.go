package cloudfuncs

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/guygrigsby/mtgfail"
	"github.com/guygrigsby/mtgfail/tabletopsimulator"
	"github.com/inconshreveable/log15"
	"golang.org/x/sync/errgroup"
)

// CreateAllFormats is an HTTP Cloud Function.
func CreateAllFormats(w http.ResponseWriter, r *http.Request) {
	log := log15.New()
	if r.Method == http.MethodOptions {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Max-Age", "3600")
		w.WriteHeader(http.StatusNoContent)
		log.Debug("CORS preflight")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), time.Second*10)
	defer cancel()

	uri := r.URL.Query().Get("deck")

	client, err := firestore.NewClient(ctx, "snackend")
	if err != nil {
		log.Error(
			"Failed to get firestore client",
			"err", err,
		)
	}
	rc, err := FetchDeck(uri, log)
	if err != nil {
		log.Error(
			"failed to fetch deck",
			"err", err,
		)
		http.Error(w, "cannot read decklist", http.StatusBadGateway)
		return
	}

	deckList, err := mtgfail.ReadCardList(rc, log)
	if err != nil {
		msg := "cannot fetch deck"
		http.Error(w, msg, http.StatusBadGateway)
	}
	store := NewFirestore(client, log)
	ret := &DualDeck{}
	g, ctx := errgroup.WithContext(ctx)
	g.Go(func() error {
		ttsDeck, err := BuildTTS(ctx, store, deckList, log)
		if err != nil {
			return err
		}
		ret.TTS = ttsDeck
		return nil
	})
	g.Go(func() error {
		internDeck, errs := BuildInternal(ctx, store, deckList, log)
		if len(errs) > 0 {
			return errs[0]
		}
		ret.Intern = internDeck
		return nil
	})
	if err := g.Wait(); err != nil {
		log.Error(
			"Cannot build decks",
			"err", err,
		)
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
