package cloudfuncs

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"sync"

	"cloud.google.com/go/firestore"
	"github.com/guygrigsby/market/functions/store"
	"github.com/inconshreveable/log15"
	"golang.org/x/sync/errgroup"
)

const (
	setsURL = "https://api.scryfall.com/sets"
)

func SyncSets(ctx context.Context, m store.PubSubMessage) error {
	log := log15.New()
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, setsURL, nil)
	if err != nil {
		log.Error(
			"cant create request",
			"err", err,
		)
		return err
	}
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Error(
			"cant make request",
			"url", setsURL,
			"err", err,
		)
		return err
	}
	b, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Error(
			"cant read response body",
			"url", setsURL,
			"err", err,
		)
		return err
	}
	defer res.Body.Close()
	var setStruct SetResponse

	err = json.Unmarshal(b, &setStruct)
	if err != nil {
		log.Error(
			"cant unmarshal response body",
			"url", setsURL,
			"err", err,
		)
		return err
	}
	sets := make(map[string]*Set)
	for _, s := range setStruct.Sets {
		sets[s.Code] = &s
	}

	var g errgroup.Group

	for code, set := range sets {
		g.Go(func() error {
			req, err := http.NewRequestWithContext(ctx, http.MethodGet, set.IconSvgURI, nil)
			if err != nil {
				log.Error(
					"cant create request for logo",
					"set", code,
					"err", err,
				)
				return err
			}
			req.Header.Set("Origin", "https://mtg.fail")
			res, err := http.DefaultClient.Do(req)
			if err != nil {
				log.Error(
					"cant make logo request ",
					"set", code,
					"err", err,
				)
				return err
			}
			b, err := ioutil.ReadAll(res.Body)
			if err != nil {
				log.Error(
					"cant read request body",
					"url", setsURL,
					"err", err,
				)
				return err
			}
			res.Body.Close()
			set.Logo = string(b)
			return nil
		})
	}
	if err := g.Wait(); err != nil {
		log.Error(
			"bailed on getting set images",
			"err", err,
		)

		return err
	}

	client, err := firestore.NewClient(ctx, "marketplace-c87d0")
	if err != nil {
		log.Error(
			"cannot create firestore client",
			"err", err,
		)

		return err
	}
	defer client.Close()

	setsRef := client.Collection("Sets")
	var batches []*firestore.WriteBatch

	var batch *firestore.WriteBatch
	i := 0
	for code, set := range sets {
		if i%500 == 0 {
			batch = client.Batch()
			batches = append(batches, batch)

		}
		doc := setsRef.Doc(code)
		batch.Set(doc, set)
		i++

	}

	var wg sync.WaitGroup
	for _, batch := range batches {
		wg.Add(1)
		go func(batch *firestore.WriteBatch) {
			defer wg.Done()
			_, err = batch.Commit(ctx)
			if err != nil {
				log.Error(
					"cannot write batch to firestore",
					"err", err,
				)

				return
			}
		}(batch)
	}
	wg.Wait()

	return nil
}

type SetResponse struct {
	Object  string `json:"object"`
	HasMore bool   `json:"has_more"`
	Sets    []Set  `json:"data"`
}
type Set struct {
	Object      string `json:"object"`
	ID          string `json:"id"`
	Code        string `json:"code"`
	Name        string `json:"name"`
	URI         string `json:"uri"`
	ScryfallURI string `json:"scryfall_uri"`
	SearchURI   string `json:"search_uri"`
	ReleasedAt  string `json:"released_at"`
	SetType     string `json:"set_type"`
	CardCount   int    `json:"card_count"`
	Digital     bool   `json:"digital"`
	NonfoilOnly bool   `json:"nonfoil_only"`
	FoilOnly    bool   `json:"foil_only"`
	IconSvgURI  string `json:"icon_svg_uri"`
	Logo        string
}
