package cloudfuncs

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/avast/retry-go"
	"github.com/guygrigsby/mtgfail"
	"github.com/inconshreveable/log15"
)

// BuildDeck ...
func BuildDeck(ctx context.Context, bulk mtgfail.CardStore, deckList map[string]int, log log15.Logger) (*DeckFile, error) {
	deck := make(map[*mtgfail.Entry]int)

	for name, count := range deckList {
		entry, err := bulk.Get(name, log)
		if entry == nil || err != nil {
			log.Warn(
				"cache miss. Calling scryfall for autocomplete",
				"name", name,
				"count", count,
				"err", err,
			)
			escName := url.QueryEscape(name)
			uri := fmt.Sprintf("https://api.scryfall.com/cards/autocomplete?q=%s", escName)

			var res *http.Response
			err := retry.Do(
				func() error {
					var err error
					c := http.Client{Timeout: 5 * time.Second}
					res, err = c.Get(uri)
					if err != nil {
						return err
					}

					return nil
				})
			if err != nil {
				log.Error(
					"cannot send request to scryfall",
					"err", err,
					"uri", uri,
				)
				continue
			}
			if res.StatusCode != 200 {
				log.Error(
					"Unexpected response status",
					"status", res.Status,
				)

				continue

			}

			b, err := ioutil.ReadAll(res.Body)
			if err != nil {
				log.Error(
					"cannot read scryfall response body",
					"err", err,
					"uri", uri,
				)
				continue
			}
			var autoComplete AutoComplete

			err = json.Unmarshal(b, &autoComplete)
			if err != nil {
				log.Error(
					"Cannot unmarshal scryfal res",
					"err", err,
				)
				continue
			}
			correctName := autoComplete.Data[0]

			entry, err = bulk.Get(correctName, log)
			if err != nil {
				log.Error(
					"Unable to get bulk  cards",
					"err", err,
				)
				continue
			}
			// set it in the local data
			err = bulk.Put(name, entry, log)
			if err != nil {
				log.Error(
					"Failed to put card",
					"err", err,
				)
				continue
			}
			log.Info(
				"Scryfall autocomplete success",
				"original", name,
				"corrected", correctName,
			)

		}

		deck[entry] = count

	}

	return buildStacks(log, deck), nil

}

type AutoComplete struct {
	Object      string   `json:"object"`
	TotalValues int      `json:"total_values"`
	Data        []string `json:"data"`
}

func buildStacks(log log15.Logger, stacks ...map[*mtgfail.Entry]int) *DeckFile {

	var (
		state []ObjectState
	)
	var deckNumber int
	cardNumber := 1
	for _, stack := range stacks {

		log.Info(
			"building stack",
			"unique cards", len(stack),
		)
		var (
			deck = make(map[int]Card, len(stack))
			ids  []int
			obs  []ContainedObject

			doubleSiders = make(map[int]Card, len(stack))
			dIDs         []int
			dObs         []ContainedObject
		)
		var cardCount int
		for entry, count := range stack {
			cardCount += count
			if entry == nil {

				log.Warn(
					"nil entry while building stack",
				)
				continue
			}
			// Card multiples
			for ; count > 0; count-- {

				cardTx := Transform{
					PosX:   0,
					PosY:   0,
					PosZ:   0,
					RotX:   0,
					RotY:   180,
					RotZ:   180,
					ScaleX: 1,
					ScaleY: 1,
					ScaleZ: 1,
				}

				id := (cardNumber) * 100
				ids = append(ids, id)
				ob := ContainedObject{
					CardID:    id,
					Name:      "Card",
					Nickname:  entry.Name,
					Transform: cardTx,
				}
				obs = append(obs, ob)
				var img string
				// Double sider
				if len(entry.CardFaces) > 1 {
					/*
											      "Name": "Card",
						      "CustomDeck": {
						        "1": {
						          "FaceURL": "https://www.frogtown.me/Images/V1/cc750c64-fd83-4b7b-9a40-a99213e6fa6d.jpg",
						          "BackURL": "https://www.frogtown.me/Images/V1/8ce7af86-2a0b-426b-8f7b-a49d6c956141.jpg",
						          "NumHeight": 1,
						          "NumWidth": 1,
						          "BackIsHidden": true
						        }
						      },
						      "Transform": {
						        "posX": 6.6000000000000005,
						        "posY": 1,
						        "posZ": 0,
						        "rotX": 0,
						        "rotY": 180,
						        "rotZ": 0,
						        "scaleX": 1,
						        "scaleY": 1,
						        "scaleZ": 1
						      },
						      "CardID": 100,
						      "Nickname": "Jace, Vryn's Prodigy // Jace, Telepath Unbound"
						    }
						  ]
						}

					*/
					token := Card{
						FaceURL:      strings.Split(entry.CardFaces[0].ImageUris.Png, "?")[0],
						BackURL:      strings.Split(entry.CardFaces[1].ImageUris.Png, "?")[0],
						NumHeight:    1,
						NumWidth:     1,
						BackIsHidden: true,
					}
					log.Debug(
						"Double sided card",
						"name", entry.Name,
						"face1", strings.Split(entry.CardFaces[0].ImageUris.Png, "?")[0],
						"face2", strings.Split(entry.CardFaces[1].ImageUris.Png, "?")[0],
					)

					cn := len(dIDs) + 1
					did := cn * 100
					dIDs = append(dIDs, did)
					dob := ContainedObject{
						CardID:    did,
						Name:      "Card",
						Nickname:  entry.Name,
						Transform: cardTx,
					}

					dObs = append(dObs, dob)
					doubleSiders[cn] = token
					img = strings.Split(entry.CardFaces[0].ImageUris.Large, "?")[0]
				} else {
					img = entry.ImageUris.Large
				}

				card := Card{
					FaceURL:      img,
					BackURL:      "https://www.frogtown.me/images/gatherer/CardBack.jpg",
					NumHeight:    1,
					NumWidth:     1,
					BackIsHidden: true,
				}

				deck[cardNumber] = card

				cardNumber++
			}

		}
		var z int
		if deckNumber == 0 {
			z = 0 // face down
		} else {

			z = 180 // face up
		}

		stackTx := Transform{
			PosX:   deckNumber + 2,
			PosY:   1,
			PosZ:   0,
			RotX:   0,
			RotY:   180,
			RotZ:   z,
			ScaleX: 1,
			ScaleY: 1,
			ScaleZ: 1,
		}

		state = append(state, ObjectState{
			Name:             "DeckCustom",
			ContainedObjects: obs,
			CustomDeck:       deck,
			DeckIDs:          ids,
			Transform:        stackTx,
		})
		for _, c := range dObs {
			stackTx.PosY = stackTx.PosY + 2
			state = append(state, ObjectState{
				Name:       "Card",
				CustomDeck: doubleSiders,
				Transform:  stackTx,
				CardID:     c.CardID,
				Nickname:   c.Nickname,
			})
		}

		deckNumber++
	}
	return &DeckFile{
		ObjectStates: state,
	}
}

type DeckFile struct {
	ObjectStates []ObjectState `json:"ObjectStates"`
}

type Card struct {
	FaceURL      string `json:"FaceURL"`
	BackURL      string `json:"BackURL"`
	NumHeight    int    `json:"NumHeight"`
	NumWidth     int    `json:"NumWidth"`
	BackIsHidden bool   `json:"BackIsHidden"`
}
type Transform struct {
	PosX   int `json:"posX"`
	PosY   int `json:"posY"`
	PosZ   int `json:"posZ"`
	RotX   int `json:"rotX"`
	RotY   int `json:"rotY"`
	RotZ   int `json:"rotZ"`
	ScaleX int `json:"scaleX"`
	ScaleY int `json:"scaleY"`
	ScaleZ int `json:"scaleZ"`
}

type ContainedObject struct {
	CardID    int       `json:"CardID"`
	Name      string    `json:"Name"`
	Nickname  string    `json:"Nickname"`
	Transform Transform `json:"Transform"`
}

type ObjectState struct {
	Name             string            `json:"Name"`
	ContainedObjects []ContainedObject `json:"ContainedObjects,omitempty"`
	CustomDeck       map[int]Card      `json:"CustomDeck"`
	DeckIDs          []int             `json:"DeckIDs,omitempty"`
	Transform        Transform         `json:"Transform"`
	CardID           int               `json:"CardID,omitempty"`
	Nickname         string            `json:"Nickname,omitempty"`
}
