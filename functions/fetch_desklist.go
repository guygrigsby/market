package cloudfuncs

import (
	"encoding/json"
	"net/http"

	"github.com/guygrigsby/mtgfail"
	"github.com/inconshreveable/log15"
)

func FetchDeckList(w http.ResponseWriter, r *http.Request) {
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
	uri := r.URL.Query().Get("deck")

	_, dr, err := FetchDeck(uri, log)
	if err != nil {
		log.Error(
			"failed to fetch deck",
			"err", err,
		)
		http.Error(w, "cannot read decklist", http.StatusBadGateway)
		return
	}
	deckList, err := mtgfail.ReadCardList(dr, log)
	if err != nil {
		msg := "cannot parse decklist"
		log.Error(
			msg,
			"err", err,
		)
		http.Error(w, msg, http.StatusBadGateway)
		return
	}
	log.Debug("parsed deck")

	b, err := json.MarshalIndent(deckList, "", "\t")
	if err != nil {

		log.Error(
			"Can't marshal list",
			"err", err,
		)
		http.Error(w, "failed to marshal decklist", http.StatusInternalServerError)
		return

	}

	w.Header().Add("Content-Type", "application/json")

	_, err = w.Write(b)
	if err != nil {
		log.Error(
			"Can't write decklist",
			"err", err,
		)
		http.Error(w, "failed to write decklist", http.StatusInternalServerError)
		return

	}

}
