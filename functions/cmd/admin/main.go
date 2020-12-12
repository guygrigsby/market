package main

import (
	"context"

	"github.com/guygrigsby/market/functions/admin"
	"github.com/inconshreveable/log15"
)

func main() {
	ctx := context.Background()
	log := log15.New()
	err := admin.ClearAnonymousUsers(ctx)
	if err != nil {
		log.Error(
			"User Cleanup Failed",
			"err", err,
		)
	}
}
