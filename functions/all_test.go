package cloudfuncs

import (
	"context"
	"encoding/json"
	"testing"

	firebase "firebase.google.com/go"
	"github.com/guygrigsby/market/functions/store"
	"github.com/guygrigsby/mtgfail"
	"github.com/inconshreveable/log15"
	"github.com/stretchr/testify/require"
	"golang.org/x/sync/errgroup"
)

func TestAll(t *testing.T) {
	ctx := context.Background()
	log := log15.New()
	conf := &firebase.Config{ProjectID: "snackend"}
	app, err := firebase.NewApp(ctx, conf)
	require.NoError(t, err)
	client, err := app.Firestore(ctx)
	require.NoError(t, err)
	store := store.NewFirestore(client, log)

	log.Debug("fetching deck")
	rc, err := FetchDeck("https://deckbox.org/sets/2785835", log)
	require.NoError(t, err)

	log.Debug("read cards")
	deckList, err := mtgfail.ReadCardList(rc, log)
	require.NoError(t, err)
	log.Debug("connect to FS")
	require.NoError(t, err)
	ret := &DualDeck{}
	g, ctx := errgroup.WithContext(ctx)
	g.Go(func() error {
		log.Debug("go tts, decklist", "deck", deckList)
		ttsDeck, err := BuildTTS(ctx, store, deckList, log)
		if err != nil {
			return err
		}
		ret.TTS = ttsDeck
		return nil
	})
	g.Go(func() error {
		log.Debug("go intern, decklist", "deck", deckList)
		internDeck, err := BuildInternal(ctx, store, deckList, log)
		if err != nil {
			return err
		}
		ret.Intern = internDeck
		return nil
	})
	log.Debug("go wait")
	require.NoError(t, g.Wait())

	b, err := json.Marshal(ret)
	log.Debug("output", string(b))
	require.NoError(t, err)

}
