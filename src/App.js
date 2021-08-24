import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Header from './components/Header.js'
import Nav from './components/Nav.js'
import Deck from './pages/Deck.js'
import Alert from './components/Alert.js'

const App = () => {
  const [deckName, setDeckName] = React.useState('')
  const [sets, setSets] = React.useState(null)
  const [deck, setDeck] = React.useState(null)
  const [ttsDeck, setTTS] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

  const setTTSDeck = (deck) => {
    setTTS(deck)
  }

  const handleCloseAlert = () => {
    setError(null)
  }
  const onError = (err) => {
    if (!err.message) {
      setError(err)
      return
    }
    setError(err.message)
  }

  return (
    <Router>
      <Header
        deck={deck}
        ttsDeck={ttsDeck}
        setTTSDeck={setTTSDeck}
        setDeck={setDeck}
        onError={onError}
      />
      <Nav sticky />
      {error && <Alert msg={error} onClose={handleCloseAlert} />}
      <Switch>
        <Route path="/decks">
          <Deck
            onError={onError}
            sets={sets}
            setSets={setSets}
            deckName={deckName}
            setDeckName={setDeckName}
            deck={deck}
            ttsDeck={ttsDeck}
            setDeck={setDeck}
            setTTSDeck={setTTSDeck}
            loading={loading}
            setLoading={setLoading}
          />
        </Route>
        {/*
        <Route path="/login">
          <LoginPage />

        </Route>
        */}
        <Route exact path="/">
          <Deck
            onError={onError}
            sets={sets}
            setSets={setSets}
            deckName={deckName}
            setDeckName={setDeckName}
            deck={deck}
            ttsDeck={ttsDeck}
            setDeck={setDeck}
            setTTSDeck={setTTSDeck}
            loading={loading}
            setLoading={setLoading}
          />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
