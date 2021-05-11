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

func FetchDeck(deckURI string, log log15.Logger) (mtgfail.DeckSite, io.ReadCloser, error) {
	log.Debug(
		"Fetch Deck",
		"url", deckURI,
	)
	var (
		err  error
		r    io.ReadCloser
		site mtgfail.DeckSite
	)

	u, err := url.Parse(deckURI)
	if err != nil {

		log.Error(
			"Cannot parse deck uri",
			"err", err,
		)
		return -1, nil, err
	}
	log.Debug(
		"Preparing to contact deck host",
		"url", deckURI,
		"host", u.Host,
	)
	switch u.Host {
	//https://tappedout.net/mtg-decks/22-01-20-kess-storm/
	case "tappedout.net":
		site = mtgfail.TappedOut
		log.Debug(
			"Fetch Deck tappedout",
			"url", deckURI,
			"host", u.Host,
		)
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
			return site, nil, err
		}
		if res.StatusCode != 200 {
			log.Error(
				"Unexpected response status",
				"status", res.Status,
			)
			return site, nil, err

		}
		r = res.Body

	// https://deckbox.org/sets/2649137
	case "deckbox.org":
		site = mtgfail.DeckBox
		log.Debug(
			"Fetch Deck deckbox",
			"url", deckURI,
			"host", u.Host,
		)
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
			return site, nil, err
		}
		if res.StatusCode != 200 {
			log.Error(
				"Unexpected response status",
				"status", res.Status,
			)
			return site, nil, errors.New("failed to contact deckbox")

		}
		r = res.Body

	default:
		log.Debug(
			"Unexpected deck Host",
			"url", deckURI,
			"Host", u.Host,
		)

		return site, nil, fmt.Errorf("Unknown Host")
	}
	return site, r, nil
}
