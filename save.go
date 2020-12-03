package cloudfuncs

import (
	"context"
	"log"

	"cloud.google.com/go/firestore"
	"github.com/guygrigsby/mtgfail"
)

type Listing struct {
	mtgfail.Entry
	condition Condition
	price     int
	count     int
}

func UpdateCardCreateIfMissing(ctx context.Context, card mtgfail.Entry, client *firestore.Client) error {
	_, err := client.Collection("cities").Doc("users").Set(ctx, card, firestore.MergeAll)

	if err != nil {
		// Handle any errors in an appropriate way, such as returning them.
		log.Printf("An error has occurred: %s", err)
	}
	return err
}
