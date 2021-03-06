package cloudfuncs

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"

	retry "github.com/avast/retry-go"
	"github.com/guygrigsby/mtgfail"
	"github.com/inconshreveable/log15"
)

func FetchDeck(deckURI string, log log15.Logger) (io.ReadCloser, error) {
	var (
		err     error
		content io.ReadCloser
	)

	u, err := url.Parse(deckURI)
	if err != nil {

		log.Error(
			"Cannot parse deck uri",
			"err", err,
		)
		return nil, err
	}
	switch u.Host {
	//https://tappedout.net/mtg-decks/22-01-20-kess-storm/
	case "tappedout.net":
		deckURI = fmt.Sprintf("%s?fmt=txt", deckURI)
		log.Debug(
			"tappedout",
			"deckUri", deckURI,
		)
		var res *http.Response
		err := retry.Do(
			func() error {
				var err error
				c := http.Client{
					Timeout: 5 * time.Second,
				}
				res, err = c.Get(deckURI)
				if err != nil {
					return err
				}
				return nil
			},
			retry.Attempts(3),
		)
		if err != nil {
			log.Error(
				"cannot get tappedout deck",
				"err", err,
				"uri", deckURI,
			)
			return nil, err
		}
		if res.StatusCode != 200 {
			log.Error(
				"Unexpected response status",
				"status", res.Status,
			)
			return nil, err

		}
		content, err = mtgfail.Normalize(res.Body, log)
		if err != nil {
			log.Error(
				"Unexpected format for deck status",
				"err", err,
				"url", deckURI,
			)
			return nil, err
		}

	// https://deckbox.org/sets/2649137
	case "deckbox.org":
		deckURI = fmt.Sprintf("%s/export", deckURI)
		log.Debug(
			"deckbox",
			"deckUri", deckURI,
		)
		var res *http.Response
		err := retry.Do(
			func() error {
				var err error
				res, err = http.DefaultClient.Get(deckURI)
				if err != nil {
					return err
				}
				return nil
			})
		if err != nil {
			log.Error(
				"cannot get deckbox deck",
				"err", err,
				"uri", deckURI,
			)
			return nil, err
		}
		if res.StatusCode != 200 {
			log.Error(
				"Unexpected response status",
				"status", res.Status,
			)
			return nil, errors.New("failed to contact deckbox")

		}

		content, err = mtgfail.Normalize(res.Body, log)
		if err != nil {
			log.Error(
				"Unexpected format for deck status",
				"err", err,
				"url", deckURI,
			)
			return nil, err
		}

	default:
		log.Debug(
			"Unexpected deck Host",
			"url", deckURI,
			"Host", u.Host,
		)

		return nil, fmt.Errorf("Unknown Host")
	}
	return content, nil
}
