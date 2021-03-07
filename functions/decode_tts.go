package cloudfuncs

import (
	"context"
	"io"
	"net/http"
	"time"

	tts "github.com/guygrigsby/mtgfail/tabletopsimulator"
	"github.com/inconshreveable/log15"
	"github.com/klauspost/compress/gzip"
)

func DecodeTTSDeck(w http.ResponseWriter, r *http.Request) {
	log := log15.New()

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Add("Access-Control-Allow-Methods", "GET")
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Add("Access-Control-Allow-Headers", "Accept-Encoding")
	w.Header().Set("Access-Control-Max-Age", "3600")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		log.Debug("CORS preflight")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	var compress, isCompressed bool
	accept := r.Header[http.CanonicalHeaderKey("Accept-Encoding")]
	for _, h := range accept {
		if h == "gzip" {
			compress = true
			break
		}
	}
	content := r.Header[http.CanonicalHeaderKey("Content-Encoding")]
	for _, h := range content {
		if h == "gzip" {
			isCompressed = true
			break
		}
	}
	var rw io.ReadCloser
	if isCompressed {
		var err error
		rw, err = gzip.NewReader(r.Body)
		if err != nil {
			log.Error(
				"Unable to unzip payload",
				"err", err,
			)
			http.Error(w, "Unable to decompress payload", http.StatusInternalServerError)
		}
	} else {
		rw = r.Body
	}
	defer rw.Close()
	internalDeck, err := tts.Decode(rw)
	if err != nil {
		msg := "unable to decode tts deck"
		log.Error(
			msg,
			"err", err,
		)
		http.Error(w, msg, http.StatusBadRequest)
		return
	}
	_ = ctx
	_ = internalDeck
	_ = compress

}
