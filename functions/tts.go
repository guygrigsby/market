package cloudfuncs

import (
	"context"
	"net/http"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/guygrigsby/mtgfail/deck"
)

// CreateTTSDeck is an HTTP Cloud Function.
func CreateTTSDeck(w http.ResponseWriter, r *http.Request) {
	log := NewLogger("debug")
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

	client, err := firestore.NewClient(ctx, projectID)
	if err != nil {
		log.Error(
			"Failed to get firestore client",
			"err", err,
		)
	}
	handler := deck.BuildTTSDeck(NewFromFirestoreClient(client, log), log)
	// Set CORS headers for the main request.
	w.Header().Set("Access-Control-Allow-Origin", "*")
	handler(w, r)
}
