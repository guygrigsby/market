package cloudfuncs

import (
	"context"
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/prometheus/common/log"
)

// PubSubMessage is the payload of a Pub/Sub event. We don't care about it.
type PubSubMessage struct {
	Data []byte `json:"data"`
}

/*
ERRO[0000] Can't unmarshal datacards(trunk){"object":"list","has_more":false,"data":[{"object":"bulk_data","id":"27bf3214-1271-490b-bdfe-c0be6c23d02e","type":"oracle_cards","updated_at":"2020-11-12T22:06:18.669+00:00","uri":"https://api.scryfall.com/bulk-data/27bf3214-1271-490b-bdfe-c0be6c23d02e","name":"Oracle Cards","description":"A JSON file containing one Scryfall card object for each Oracle ID on Scryfall. The chosen sets for the cards are an attempt to return the most up-to-date recognizable version of the card.","compressed_size":11068636,"download_uri":"https://c2.scryfall.com/file/scryfall-bulk/oracle-cards/oracle-cards-20201112220618.json","content_type":"application/json","content_encoding":"gzip"},{"object":"bulk_data","id":"6bbcf976-6369-4401-88fc-3a9e4984c305","type":"unique_artwork","updated_at":"2020-11-12T22:22:11.247+00:00","uri":"https://api.scryfall.com/bulk-data/6bbcf976-6369-4401-88fc-3a9e4984c305","name":"Unique Artwork","description":"A JSON file of Scryfall card objects that together contain all unique artworks. The chosen cards promote the best image scans.","compressed_size":13513178,"download_uri":"https://c2.scryfall.com/file/scryfall-bulk/unique-artwork/unique-artwork-20201112222211.json","content_type":"application/json","content_encoding":"gzip"},{"object":"bulk_data","id":"e2ef41e3-5778-4bc2-af3f-78eca4dd9c23","type":"default_cards","updated_at":"2020-11-12T22:04:24.937+00:00","uri":"https://api.scryfall.com/bulk-data/e2ef41e3-5778-4bc2-af3f-78eca4dd9c23","name":"Default Cards","description":"A JSON file containing every card object on Scryfall in English or the printed language if the card is only available in one language.","compressed_size":27273367,"download_uri":"https://c2.scryfall.com/file/scryfall-bulk/default-cards/default-cards-20201112220424.json","content_type":"application/json","content_encoding":"gzip"]err<nil>  source="sync_cards.go:135"
*/
type Payload struct {
	URL string `json:"url"`
}

const (
	scryfall = "https://api.scryfall.com/bulk-data"
)

type BulkData struct {
	Object  string `json:"object"`
	HasMore bool   `json:"has_more"`
	Data    []struct {
		Object          string    `json:"object"`
		ID              string    `json:"id"`
		Type            string    `json:"type"`
		UpdatedAt       time.Time `json:"updated_at"`
		URI             string    `json:"uri"`
		Name            string    `json:"name"`
		Description     string    `json:"description"`
		CompressedSize  int       `json:"compressed_size"`
		DownloadURI     string    `json:"download_uri"`
		ContentType     string    `json:"content_type"`
		ContentEncoding string    `json:"content_encoding"`
	} `json:"data"`
}

func Sync(ctx context.Context, m PubSubMessage) error {
	var (
		pay Payload
		err error
		res *http.Response
	)
	err = json.Unmarshal(m.Data, &pay)
	if err != nil {
		log.Error(
			"parse pub sub payload failed",
			"err", err,
		)
		return err
	}
	res, err = http.DefaultClient.Get(pay.URL)
	if err != nil {
		log.Error(
			"cannot retrieve bulk data",
			"URL", scryfall,
			"err", err,
		)
		return err
	}
	defer res.Body.Close()
	b, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Error(
			"Can't read file",
			"err", err,
		)
		return err
	}
	var bulk BulkData
	err = json.Unmarshal(b, &bulk)
	if err != nil {
		log.Error(
			"parse cards failed",
			"err", err,
		)
		return err
	}
	for _, u := range bulk.Data {
		if u.Type == "default_cards" {
			log.Infof("type %s url %s", u.Type, u.DownloadURI)
			return BulkSync(ctx, u.DownloadURI)
		}
	}
	return errors.New(`No "default cards" type to upload`)
}
