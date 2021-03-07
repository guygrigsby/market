package store

import (
	"testing"

	"github.com/inconshreveable/log15"
	"github.com/stretchr/testify/require"
)

func TestNormalizeCardName(t *testing.T) {
	tests := []struct {
		name          string
		correctResult string
	}{
		{
			"Liliana, Heretical Healer // Liliana, Defiant Necromancer",
			"Liliana, Heretical Healer",
		},
		{
			"Shepherd of the Flock // Usher to Safety",
			"Shepherd of the Flock",
		},
	}

	for _, test := range tests {
		require.Equal(t, test.correctResult, CardKey(test.name, log15.New()))
	}

}
