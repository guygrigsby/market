package cloudfuncs

import (
	"context"
	"testing"

	"github.com/guygrigsby/market/functions/store"
	"github.com/stretchr/testify/require"
)

func TestSyncCards(t *testing.T) {
	require.NoError(
		t,
		SyncCards(context.Background(), store.PubSubMessage{}),
	)
}
