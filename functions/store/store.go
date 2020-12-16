package store

import (
	"context"
	"fmt"
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

func (c *cardStore) PutMany(_ map[string]*mtgfail.Entry, _ log15.Logger) error {
	return nil
}
func (c *cardStore) Put(_ string, _ *mtgfail.Entry, _ log15.Logger) error {
	return nil
}

func NormalizeCard(card *mtgfail.Entry, log log15.Logger) {
	card.Name = NormalizeCardName(card.Name, log)
}

func NormalizeCardName(name string, log log15.Logger) string {
	var prev rune
	for i, r := range name {
		if r == '/' && prev == '/' {
			return name[:i-2]
		}
		prev = r

	}
	return name
}

func (c *cardStore) Get(name string, log log15.Logger) (*mtgfail.Entry, error) {
	e, err := c.GetMany([]string{name}, log)
	if err != nil {
		return nil, err
	}
	if len(e) == 0 {
		return nil, fmt.Errorf("No card available for %s", name)
	}
	return e[0], nil
}
func (c *cardStore) GetMany(names []string, log log15.Logger) ([]*mtgfail.Entry, error) {

	coll := c.client.Collection(collection)
	ctx := context.Background()
	results := make(chan *mtgfail.Entry)
	errs := make(chan error)
	var wg sync.WaitGroup

	for _, n := range names {
		wg.Add(1)
		n := n
		go func() {
			defer wg.Done()
			name := NormalizeCardName(n, log)
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
			c.log.Error("gather error", "err", err)
			return nil, err
		}
	}

	return cards, nil
}
