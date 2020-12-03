package listing

import (
	"context"
	"fmt"
	"testing"

	"github.com/guygrigsby/mtgfail"
	"github.com/stretchr/testify/require"
)

func TestPublish(t *testing.T) {
	ctx := context.Background()
	msg := &Listing{
		&mtgfail.Entry{},
		M,
		392,
		2,
	}
	res, err := Publish(ctx, "marketplace-c87d0", "listings", msg, "/Users/guygrigsby/listing-publisher.json")
	require.NoError(t, err)
	fmt.Println(res)
}
