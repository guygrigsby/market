package cloudfuncs

import (
	"context"
	"net/http"
	"strings"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/guygrigsby/mtgfail"
	"github.com/guygrigsby/mtgfail/deck"
	"github.com/inconshreveable/log15"
	"github.com/prometheus/common/log"
)

const (
	projectID  = "snackend"
	collection = "cards"
)

type cardStore struct {
	client *firestore.Client
	log    log15.Logger
}

func (cs *cardStore) Warm(_ []string) {
}

func (c *cardStore) Get(name string) *mtgfail.Entry {
	if strings.Contains(name, "//") {
		name = strings.ReplaceAll(name, "//", "")
	}

	cards := c.client.Collection("cards")
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	doc := cards.Doc(name)
	docsnap, err := doc.Get(ctx)
	if err != nil {
		c.log.Error(
			"Cannot Get Data from store",
			"err", err,
			"name", name,
		)
		return nil
	}
	entry := &mtgfail.Entry{}

	err = docsnap.DataTo(entry)
	if err != nil {
		c.log.Error(
			"Cannot extract Data",
			"err", err,
			"name", name,
		)
		return nil
	}

	return entry
}

func (c *cardStore) Put(name string, entry *mtgfail.Entry) error {
	if strings.Contains(name, "//") {
		name = strings.ReplaceAll(name, "//", "")
	}
	cards := c.client.Collection("cards")

	doc := cards.Doc(name)
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*1)
	defer cancel()
	wr, err := doc.Set(ctx, entry)
	if err != nil {
		log.Error(
			"cannot create document skipping",
			"err", err,
			"res", wr,
		)
	}
	return nil
}
func (c *cardStore) Count() int {
	return 0
}

// NewFromFirestoreClient ...
func NewFromFirestoreClient(c *firestore.Client, log log15.Logger) mtgfail.CardStore {
	return &cardStore{c, log}
}

// CreateInternalDeck is an HTTP Cloud Function.
func CreateInternalDeck(w http.ResponseWriter, r *http.Request) {
	log := NewLogger("debug")
	// Set CORS headers for the preflight request
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
	handler := deck.BuildInternalDeck(NewFromFirestoreClient(client, log), log)
	// Set CORS headers for the main request.
	w.Header().Set("Access-Control-Allow-Origin", "*")
	handler(w, r)
}
