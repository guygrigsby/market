package cloudfuncs

import (
	"context"
	"fmt"
	"strings"
	"sync"
	"time"

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
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()
	results := make(chan *mtgfail.Entry)
	errs := make(chan error)
	var wg sync.WaitGroup

	for _, name := range names {
		wg.Add(1)
		name := name
		go func() {
			defer wg.Done()

			c.log.Debug("go read doc", "name", name)
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
			c.log.Debug("go read doc done", "name", name)
			results <- entry
		}()
	}
	c.log.Debug("main preparing to gather")

	var cards []*mtgfail.Entry
	for range names {
		c.log.Debug("gather loop")
		select {
		case entry := <-results:
			c.log.Debug("gather result doc", "name", entry.Name)
			cards = append(cards, entry)
		case err := <-errs:
			c.log.Debug("gather error", "err", err)
			return nil, err
		}
	}

	return cards, nil
}
