package cloudfuncs

import (
	"net/http"

	"github.com/inconshreveable/log15"
)

func CORS(routeHandler http.HandlerFunc, log log15.Logger) http.HandlerFunc {
	log.Debug("Setting up middleware")
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Debug("In CORS handler")
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
		log.Debug("not CORS preflight")
		routeHandler.ServeHTTP(w, r)
	})
}
