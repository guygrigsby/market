package cloudfuncs

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"cloud.google.com/go/pubsub"
	"github.com/inconshreveable/log15"
)

func CORS(w http.ResponseWriter, r *http.Request, log log15.Logger) bool {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Add("Access-Control-Allow-Methods", "GET")
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Add("Access-Control-Allow-Headers", "Accept-Encoding")
	w.Header().Set("Access-Control-Max-Age", "3600")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		log.Debug("CORS preflight")
		return true
	}
	return false
}

type Condition int

const (
	M Condition = iota
	NM
	LP
	MP
	HP
)

type Listing struct {
	ID        string
	Condition Condition
	Price     int
}

func ListItem(w http.ResponseWriter, r *http.Request) {
	log := log15.New()
	if CORS(w, r, log) {
		return
	}

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		msg := "cannot read request body"
		log.Error(
			msg,
			"err", err,
		)
		http.Error(w, msg, http.StatusInternalServerError)
		return
	}

	var listing Listing

	err = json.Unmarshal(body, &listing)
	// just validating
	if err != nil {
		msg := "unexpected request body"
		log.Error(
			msg,
			"err", err,
			"body", string(body),
		)
		http.Error(w, msg, http.StatusBadRequest)
		return
	}
	b, err := json.Marshal(listing)
	if err != nil {
		msg := "unexpected request body"
		log.Error(
			msg,
			"err", err,
			"body", string(body),
		)
		http.Error(w, msg, http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), time.Second*10)
	defer cancel()

	id, err := Publish(ctx, "snackend", "projects/snackend/topics/listings", b)
	if err != nil {
		msg := "cannot publish listing"
		log.Error(
			msg,
			"err", err,
		)
		http.Error(w, msg, http.StatusInternalServerError)
		return
	}
	b, err = json.Marshal(map[string]string{"id": id})
	if err != nil {
		msg := "cannot marshal listing id"
		log.Error(
			msg,
			"err", err,
		)
		http.Error(w, msg, http.StatusInternalServerError)
		return
	}
	_, _ = w.Write(b)

}
func Publish(ctx context.Context, projectID string, topicID string, msg interface{}) (string, error) {

	b, err := json.Marshal(msg)
	if err != nil {
		return "", fmt.Errorf("Can't marshal: %v", err)
	}

	client, err := pubsub.NewClient(ctx, projectID)
	if err != nil {
		return "", fmt.Errorf("pubsub.NewClient: %v", err)
	}

	t := client.Topic(topicID)
	t.PublishSettings.NumGoroutines = 1

	result := t.Publish(ctx, &pubsub.Message{Data: b})
	// Block until the result is returned and a server-generated
	// ID is returned for the published message.
	id, err := result.Get(ctx)
	if err != nil {
		return "", fmt.Errorf("Get: %v", err)
	}
	return id, nil
}
