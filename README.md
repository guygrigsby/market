# Market

This is the deckbuilder side for mtg.fail. It's called market because the goal was to build a trading market as well, eventually.

## Usage

### Local

1. Run `make run-functions` in it's own shell or if you want to point at production cloud funcs change `Upstream` in `deck.js` to point to 'https://us-central1-marketplace-c87d0.cloudfunctions.net' for all environments.

2. First Run

You must call `yarn install`

3. Run `yarn start`

Notes:
	Regardless of if the func are running locally or not, the will accesss the prod firestore. Currently, we do not have a way to use the local mock firestore.


