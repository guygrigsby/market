package cloudfuncs

import (
	"context"
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

type Store interface {
	Get([]string) ([]*mtgfail.Entry, []error)
	Put(map[string]interface{})
}

// NewFromFirestoreClient ...
func NewFirestore(c *firestore.Client, log log15.Logger) Store {
	return &cardStore{c, log}
}

type cardStore struct {
	client *firestore.Client
	log    log15.Logger
}

func (c *cardStore) Put(_ map[string]interface{}) {
}

func (c *cardStore) Get(names []string) ([]*mtgfail.Entry, []error) {

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
	var errors []error
	for range names {
		c.log.Debug("gather loop")
		select {
		case entry := <-results:
			c.log.Debug("gather result doc", "name", entry.Name)
			cards = append(cards, entry)
		case err := <-errs:
			c.log.Debug("gather error", "err", err)
			errors = append(errors, err)
		}
	}

	return cards, errors
}
