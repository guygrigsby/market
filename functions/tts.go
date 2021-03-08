package cloudfuncs

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"net/http"

	"cloud.google.com/go/firestore"
	"github.com/getlantern/deepcopy"
	"github.com/guygrigsby/market/functions/store"
	"github.com/guygrigsby/mtgfail"
	"github.com/guygrigsby/mtgfail/tabletopsimulator"
	"github.com/inconshreveable/log15"
)

// CreateAllFormats is an HTTP Cloud Function.
func CreateTTSDeckFromInternal(w http.ResponseWriter, r *http.Request) {
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
	ctx := context.Background()

	client, err := firestore.NewClient(ctx, "snackend")
	if err != nil {
		log.Error(
			"Failed to get firestore client",
			"err", err,
		)
		return
	}

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Error(
			"Failed to read deck body",
			"err", err,
		)
		http.Error(w, "can't read request", http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	var deck []mtgfail.Entry
	err = json.Unmarshal(body, &deck)
	if err != nil {
		msg := "Can't unmarshal deck"

		log.Error(
			"msg", msg,
			"err", err,
		)
		http.Error(w, msg, http.StatusBadRequest)
		return

	}

	deckList := getDecklistFromInternal(deck)

	store := store.NewFirestore(client, log)
	log.Debug("starting TTS build")
	ttsDeck, err := tabletopsimulator.BuildDeck(ctx, store, deckList, log)
	if err != nil {
		msg := "Can't build TTS deck"

		log.Error(
			"msg", msg,
			"err", err,
			"decklist", deckList,
			"deck", deck,
		)
		http.Error(w, msg, http.StatusInternalServerError)
		return
	}

	b, err := json.Marshal(&ttsDeck)
	if err != nil {

		log.Error(
			"Can't marshal deckfile",
			"err", err,
		)
		http.Error(w, "can't marshal response", http.StatusInternalServerError)
		return

	}

	w.Header().Add("Content-Type", "application/json")

	_, err = w.Write(b)
	if err != nil {
		log.Error(
			"Can't write deck",
			"err", err,
		)
		http.Error(w, "can't write response", http.StatusInternalServerError)
		return

	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
}

func getDecklistFromInternal(deck []mtgfail.Entry) map[string]int {
	dl := make(map[string]int)
	for _, card := range deck {
		curr := dl[card.Name]
		curr++
		dl[card.Name] = curr

	}
	return dl
}

// BuildDeck ...
func BuildTTS(ctx context.Context, decklist map[string]int, entries []*mtgfail.Entry, log log15.Logger) (*tabletopsimulator.DeckFile, error) {
	tokenDeck := make(map[*mtgfail.Entry]int)
	deck := make(map[*mtgfail.Entry]int)

	for _, entry := range entries {
		count := decklist[entry.Name]
		if entry.CardFaces != nil && entry.CardFaces[0].ImageUris.Png != "" {
			var proxy mtgfail.Entry
			err := deepcopy.Copy(&proxy, entry)
			if err != nil {
				log.Error(
					"failed to create card copy for double sided card",
					"err", err,
				)
				return nil, err
			}
			tokenDeck[entry] = count
			proxy.ImageUris = entry.CardFaces[0].ImageUris
			proxy.CardFaces = nil
			entry = &proxy

		}

		deck[entry] = count

	}
	if len(tokenDeck) > 0 {
		return tabletopsimulator.BuildStacks(log, deck, tokenDeck)
	}
	return tabletopsimulator.BuildStacks(log, deck)

}
