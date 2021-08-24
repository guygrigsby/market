package cloudfuncs

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
	"time"

	firebase "firebase.google.com/go"
	"github.com/getlantern/deepcopy"
	"github.com/guygrigsby/market/functions/store"
	"github.com/guygrigsby/mtgfail"
	"github.com/guygrigsby/mtgfail/tabletopsimulator"
	"github.com/inconshreveable/log15"
	"google.golang.org/api/option"
)

func CreateAllFormatsLocal(w http.ResponseWriter, r *http.Request) {
	r.Header.Set("testing", "true")
	CreateAllFormats(w, r)
}
func recTime(last time.Time, msg string, log log15.Logger) time.Time {
	n := time.Since(last)
	log.Info(
		"Time",
		"msg", msg,
		"elapsed", n,
	)
	return last.Add(n)
}

// CreateAllFormats makes both internal and tts formats decks
func CreateAllFormats(w http.ResponseWriter, r *http.Request) {
	start := time.Now()

	log := log15.New()

	log.Debug("created Handler")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Add("Access-Control-Allow-Methods", "GET")
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Add("Access-Control-Allow-Headers", "Accept-Encoding")
	w.Header().Add("Access-Control-Allow-Headers", "Accept")
	w.Header().Set("Access-Control-Max-Age", "3600")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		log.Debug("CORS preflight")
		return
	}
	ctx := r.Context()
	var (
		rc   io.ReadCloser
		err  error
		site mtgfail.DeckSite = -1
	)
	hasBodyDeck := r.URL.Query().Get("decklist") != ""

	f := recTime(start, "Starting FetchDeck", log)
	if hasBodyDeck {
		log.Debug("decklist sent")
		site = mtgfail.RawDeck
		rc = r.Body
	} else {
		uri := r.URL.Query().Get("deck")
		log.Debug(
			"no decklist",
			"value", hasBodyDeck,
			"uri", uri,
		)
		site, rc, err = FetchDeck(uri, log)
		if err != nil {
			log.Error(
				"failed to fetch deck",
				"err", err,
			)
			http.Error(w, "cannot read decklist", http.StatusBadGateway)
			return
		}
		log.Debug("fetched deck")
	}
	fe := recTime(f, "Ending FetchDeck", log)
	n := recTime(fe, "Starting Normalize", log)
	deckList, err := mtgfail.Normalize(site, rc, log)
	log.Debug("decklist", "val", deckList)
	ne := recTime(n, "Ending Normalize", log)
	if err != nil {
		msg := "cannot fetch deck"
		log.Error(
			"can't read cards",
			"err", err,
		)
		http.Error(w, msg, http.StatusBadRequest)
		return
	}

	credsFile := os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")

	config := &firebase.Config{ProjectID: "marketplace-c87d0"}
	opt := option.WithCredentialsFile(credsFile)
	app, err := firebase.NewApp(ctx, config, opt)
	if err != nil {
		log.Error(
			"Failed to get firebase app",
			"err", err,
		)
		http.Error(w, "failed to get firebase app", http.StatusInternalServerError)
		return
	}

	client, err := app.Firestore(ctx)
	if err != nil {
		log.Error(
			"Failed to get firestore client",
			"err", err,
		)
		http.Error(w, "failed to get firestore client", http.StatusInternalServerError)
		return
	}
	fb := store.NewFirestore(client, log)

	ret := &DualDeck{}
	var names []string
	for name := range deckList {
		names = append(names, name)

	}
	s := recTime(ne, "Starting Store Access", log)
	entries, errs := fb.GetMany(names, log)
	se := recTime(s, "Ending Store Access", log)
	if len(errs) > 0 {
		log.Warn(
			"Errors occurred while getting cards from store",
			"errs", errs,
		)
		ret.Errors = errs
	}

	t := recTime(se, "Starting BuildTTS", log)
	ttsDeck, err := BuildTTS(ctx, deckList, entries, log)
	recTime(t, "Ending BuildTTS", log)
	if err != nil {
		log.Error(
			"Failed to build TTS deck",
			"err", err,
		)
		return
	}
	ret.TTS = ttsDeck
	mults, err := genDups(entries, deckList, log)
	if err != nil {
		msg := "cannot create copies for card multiples"
		log.Error(
			msg,
			"err", err,
		)
		http.Error(w, msg, http.StatusInternalServerError)
		return
	}
	ret.Intern = mults

	b, err := json.Marshal(ret)
	if err != nil {

		log.Error(
			"Can't marshal deckfile",
			"err", err,
		)
		return

	}

	w.Header().Add("Content-Type", "application/json")

	_, err = w.Write(b)
	if err != nil {
		log.Error(
			"Can't write dual deckfile",
			"err", err,
		)
		return

	}
	w.Header().Set("Access-Control-Allow-Origin", "*")

	recTime(start, "Ending Handler", log)

}
func genDups(entries []*mtgfail.Entry, dl map[string]int, log log15.Logger) ([]*mtgfail.Entry, error) {
	var news []*mtgfail.Entry
	for _, entry := range entries {
		if count, ok := dl[entry.Name]; ok {
			for i := 1; i < count; i++ {
				var newEntry mtgfail.Entry
				err := deepcopy.Copy(&newEntry, entry)
				if err != nil {
					log.Error(
						"cannot copy duplicate card",
						"card", entry.Name,
						"err", err,
					)
					return nil, err
				}
				news = append(news, &newEntry)
			}

		}
	}
	return append(news, entries...), nil
}
func cardCount(deck map[string]int) int {
	var count int
	for _, v := range deck {
		count += v
	}
	return count
}

type DualDeck struct {
	TTS    *tabletopsimulator.DeckFile `json:"tts,omitempty"`
	Intern []*mtgfail.Entry            `json:"internal,omitempty"`
	Errors []error                     `json:"errors,omitempty"`
}

func keySet(m map[string]int) []string {
	var s []string
	for k := range m {
		s = append(s, k)
	}
	return s
}
