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
	queue := make(chan string)
	results := make(chan *mtgfail.Entry)
	errs := make(chan error)
	go func() {
		for _, v := range names {
			queue <- v
		}
	}()
	var wg sync.WaitGroup
	for name := range queue {
		wg.Add(1)
		name := name
		ctx, gocancel := context.WithTimeout(ctx, time.Millisecond*100)
		go func() {
			defer func() {
				gocancel()
				wg.Done()
			}()
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
	var errors []error

	for range names {
		select {
		case entry := <-results:
			cards = append(cards, entry)
		case err := <-errs:
			errors = append(errors, err)
		}
	}

	return cards, errors
}
