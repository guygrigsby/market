package cloudfuncs

import (
	"context"
	"testing"
)

func TestSync(t *testing.T) {
	Sync(
		context.Background(),
		PubSubMessage{
			Data: []byte(`{"url":"https://api.scryfall.com/bulk-data"}`),
		},
	)
}
