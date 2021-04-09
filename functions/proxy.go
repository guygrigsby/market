package cloudfuncs

import (
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"

	"github.com/guygrigsby/mtgfail"
	"github.com/inconshreveable/log15"
)

func Proxy(w http.ResponseWriter, r *http.Request) {
	log := log15.New()
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Add("Access-Control-Allow-Methods", "GET")
	w.Header().Add("Access-Control-Allow-Methods", "OPTIONS")
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Add("Access-Control-Allow-Headers", "Accept-Encoding")
	w.Header().Add("Access-Control-Allow-Headers", "Accept")
	w.Header().Set("Access-Control-Max-Age", "3600")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		log.Debug("CORS preflight")
		return
	}
	u := r.URL.Query().Get("upstream")
	upstream, err := sanitizeURL(u)
	if err != nil {
		msg := "CORS upstream url did not pass checks"
		log.Debug(
			msg,
			"url", upstream,
		)
		http.Error(w, msg, http.StatusForbidden)
		return
	}
	if err != nil {
		msg := " CORS proxy cannot parse upstream url"
		log.Debug(
			msg,
			"url", upstream,
			"err", err,
		)
		http.Error(w, msg, http.StatusBadRequest)
		return

	}
	res, err := http.DefaultClient.Get(upstream.String())
	if err != nil {
		log.Error(
			"unable to call upstream",
			"err", err,
		)
		http.Error(w, "upstream call failed", http.StatusUseProxy)
	}
	defer res.Body.Close()

	b, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Error(
			"unable to read body",
			"err", err,
		)
		http.Error(w, "cannot read upstream response", http.StatusInternalServerError)
	}
	_, err = fmt.Fprintf(w, "%s", b)
	if err != nil {
		log.Error(
			"unable to write response",
			"err", err,
		)
		http.Error(w, "cannot write response", http.StatusInternalServerError)
	}
}

func sanitizeURL(uri string) (*url.URL, error) {
	supported, cleaned, err := mtgfail.SanitizeURL(uri)
	if err != nil {
		return nil, err
	}
	if !supported {
		return nil, errors.New("unsupported decksite")
	}
	return cleaned, nil
}
