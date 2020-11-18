package cloudfuncs

import (
	"context"

	"github.com/guygrigsby/mtgfail"
	"github.com/guygrigsby/mtgfail/tabletopsimulator"
	"github.com/inconshreveable/log15"
)

// BuildDeck ...
func BuildTTS(ctx context.Context, bulk Store, deckList map[string]int, log log15.Logger) (*tabletopsimulator.DeckFile, error) {
	deck := make(map[*mtgfail.Entry]int)
	names := make([]string, len(deckList))
	counts := make([]int, len(deckList))
	var i int
	for name, count := range deckList {
		names[i] = name
		counts[i] = count
		i++

	}
	bulk.Get(names)

	return tabletopsimulator.BuildStacks(log, deck), nil

}
