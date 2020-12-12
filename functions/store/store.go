package store

import (
	"context"
	"fmt"
	"strings"
	"sync"

	"cloud.google.com/go/firestore"
	"github.com/guygrigsby/mtgfail"
	"github.com/inconshreveable/log15"
)

const (
	collection = "cards"
)

// NewFromFirestoreClient ...
func NewFirestore(c *firestore.Client, log log15.Logger) mtgfail.CardStore {
	return &cardStore{c, log}
}

type cardStore struct {
	client *firestore.Client
	log    log15.Logger
}

func (c *cardStore) PutMany(_ map[string]*mtgfail.Entry) error {
	return nil
}
func (c *cardStore) Put(_ string, _ *mtgfail.Entry) error {
	return nil
}

func (c *cardStore) Get(name string) (*mtgfail.Entry, error) {
	e, err := c.GetMany([]string{name})
	if err != nil {
		return nil, err
	}
	if len(e) == 0 {
		return nil, fmt.Errorf("No card available for %s", name)
	}
	return e[0], nil
}

func (c *cardStore) GetMany(names []string) ([]*mtgfail.Entry, error) {

	coll := c.client.Collection(collection)
	ctx := context.Background()
	results := make(chan *mtgfail.Entry)
	errs := make(chan error)
	var wg sync.WaitGroup

	for _, name := range names {
		wg.Add(1)
		name := name
		go func() {
			defer wg.Done()

			if strings.Contains(name, "//") {
				name = strings.ReplaceAll(name, "//", "")
			}
			doc := coll.Doc(name)
			docsnap, err := doc.Get(ctx)
			if err != nil {
				c.log.Error(
					"Cannot Get Data from store",
					"err", err,
					"name", name,
				)
				errs <- err
				return
			}
			entry := &mtgfail.Entry{}

			err = docsnap.DataTo(entry)
			if err != nil {
				c.log.Error(
					"Cannot extract Data",
					"err", err,
					"name", name,
				)
				errs <- err
				return
			}
			results <- entry
		}()
	}

	var cards []*mtgfail.Entry
	for range names {
		select {
		case entry := <-results:
			cards = append(cards, entry)
		case err := <-errs:
			c.log.Debug("gather error", "err", err)
			return nil, err
		}
	}

	return cards, nil
}
