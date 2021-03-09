package store

import (
	"context"
	"fmt"
	"strings"
	"sync"

	"cloud.google.com/go/firestore"
	"github.com/guygrigsby/mtgfail"
	"github.com/inconshreveable/log15"
	"github.com/pkg/errors"
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

func (c *cardStore) PutMany(cards map[string]*mtgfail.Entry, log log15.Logger) error {

	coll := c.client.Collection(collection)
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	results := make(chan *firestore.WriteResult)
	errs := make(chan error)
	var wg sync.WaitGroup

	for k, v := range cards {
		wg.Add(1)
		name, card := k, v
		go func() {
			defer wg.Done()
			key := CardKey(name, log)
			doc := coll.Doc(key)
			wr, err := doc.Set(ctx, card)
			if err != nil {
				c.log.Error(
					"Cannot Set Data in store.",
					"err", err,
					"name", name,
				)
				errs <- err
				return
			}
			results <- wr
		}()
	}

	for range cards {
		select {
		case <-results:
		case err := <-errs:
			c.log.Error(
				"Error in write. Canceling",
				"err", err,
			)
			return err
		}
	}

	return nil
}
func (c *cardStore) Put(key string, card *mtgfail.Entry, log log15.Logger) error {

	coll := c.client.Collection(collection)
	ctx := context.Background()

	key = CardKey(key, log)
	doc := coll.Doc(key)
	_, err := doc.Set(ctx, card)
	if err != nil {
		c.log.Error(
			"Cannot put data to store",
			"err", err,
			"name", card.Name,
			"key", key,
		)
		return err
	}

	return nil
}

func CardKey(name string, log log15.Logger) string {

	return mtgfail.Key(strings.ToLower(name))

}

func (c *cardStore) Get(name string, log log15.Logger) (*mtgfail.Entry, error) {
	e, errs := c.GetMany([]string{name}, log)
	if len(errs) > 0 {
		return nil, errs[0]
	}
	if len(e) == 0 {
		return nil, fmt.Errorf("No card available for %s", name)
	}
	return e[0], nil
}
func (c *cardStore) GetMany(names []string, log log15.Logger) ([]*mtgfail.Entry, []error) {

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
			key := CardKey(n, log)
			doc := coll.Doc(key)
			docsnap, err := doc.Get(ctx)
			if err != nil {
				// Try to query by name
				if docsnap, err = Contains(ctx, n, coll, log); err != nil {
					c.log.Error(
						"Cannot Get Data from store",
						"err", err,
						"name", n,
						"key", key,
					)
					errs <- errors.Wrap(err, fmt.Sprintf("Unable to find card %s:", n))
					return
				}

			}
			entry := &mtgfail.Entry{}

			err = docsnap.DataTo(entry)
			if err != nil {
				c.log.Error(
					"Cannot extract Data",
					"err", err,
					"name", n,
					"key", key,
				)
				errs <- err
				return
			}
			results <- entry
		}()
	}

	var cards []*mtgfail.Entry
	var e []error
	for range names {
		select {
		case entry := <-results:
			cards = append(cards, entry)
		case err := <-errs:
			c.log.Error("gather error", "err", err)
			e = append(e, err)
		}
	}

	return cards, e
}
func Contains(ctx context.Context, str string, collection *firestore.CollectionRef, log log15.Logger) (*firestore.DocumentSnapshot, error) {

	strPlusOne := fmt.Sprintf("%s%c", str[:len(str)-2], str[len(str)-1]+1)
	q := collection.Where("Name", ">=", str).Where("Name", "<", strPlusOne)
	iter := q.Documents(ctx)
	// just grab the first one
	doc, err := iter.Next()
	if err != nil {
		log.Error(
			"failed to query store: Contains",
			"where", str,
		)
		return nil, err
	}
	return doc, nil

}
