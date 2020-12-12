package cloudfuncs

import (
	"context"

	"github.com/guygrigsby/mtgfail"
	"github.com/inconshreveable/log15"
)

// BuildDeck ...
func BuildInternal(ctx context.Context, store mtgfail.CardStore, deckList map[string]int, log log15.Logger) ([]*mtgfail.Entry, error) {

	names := make([]string, len(deckList))
	counts := make([]int, len(deckList))
	var i int
	for name, count := range deckList {
		names[i] = name
		counts[i] = count
		i++

	}
	return store.GetMany(names)

}
