package cloudfuncs

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"sync"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/guygrigsby/market/functions/store"
	"github.com/inconshreveable/log15"
	"google.golang.org/api/iterator"
)

const (
	setsURL = "https://api.scryfall.com/sets"
)

func GetSets(w http.ResponseWriter, r *http.Request) {

	log := log15.New()
	route := GetSetsHelp(log)
	log.Debug(
		"preparing handler",
		"w", w,
		"route", route,
	)
	handler := CORS(route, log)
	log.Debug(
		"calling handler",
		"handler", handler,
		"w", w,
	)
	handler.ServeHTTP(w, r)
}
func GetSetsHelp(log log15.Logger) http.HandlerFunc {
	log.Debug("Setting up getSets")
	return func(w http.ResponseWriter, r *http.Request) {
		log.Debug("getSets")
		ctx := r.Context()
		client, err := firestore.NewClient(ctx, "marketplace-c87d0")
		if err != nil {
			msg := "cannot create firestore client"

			log.Error(
				msg,
				"err", err,
			)
			http.Error(w, msg, http.StatusInternalServerError)
			return
		}
		defer client.Close()
		ctx, cancel := context.WithTimeout(ctx, time.Second*1)
		defer cancel()

		var sets []*Set

		iter := client.Collection("Sets").Documents(ctx)
		for {
			doc, err := iter.Next()
			if err == iterator.Done {
				break
			}
			if err != nil {
				msg := "error reading sets"
				log.Error(
					msg,
					"err", err,
				)
				http.Error(w, msg, http.StatusInternalServerError)
				return
			}
			var set Set
			err = doc.DataTo(&set)
			if err != nil {
				msg := "error unmarshaling set"

				log.Error(
					msg,
					"set", doc.Ref.ID,
					"err", err,
				)
				http.Error(w, msg, http.StatusInternalServerError)
				return
			}
			sets = append(sets, &set)
			b, err := json.Marshal(sets)
			if err != nil {
				msg := "Can't marshal sets response"

				log.Error(
					"err", err,
				)
				http.Error(w, msg, http.StatusInternalServerError)
				return

			}

			w.Header().Add("Content-Type", "application/json")

			_, err = w.Write(b)
			if err != nil {
				msg := "Can't write sets response"
				log.Error(
					msg,
					"err", err,
				)
				http.Error(w, msg, http.StatusInternalServerError)
				return

			}
			w.Header().Set("Access-Control-Allow-Origin", "*")

		}

	}
}
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

	for code, set := range sets {
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
		time.Sleep(time.Millisecond * 50) // https://scryfall.com/docs/api
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
	Logo        string `json:"logo"`
}
