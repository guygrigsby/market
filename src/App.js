import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Header from './components/Header.js'
import Nav from './components/Nav.js'
import Buying from './pages/Buying.js'
import LoginPage from './pages/Login.js'
import Deck from './pages/Deck.js'
import Selling from './pages/Selling.js'
import 'firebase/auth'

const App = () => {
  const [deckName, setDeckName] = React.useState('')
  const [sets, setSets] = React.useState(null)
  const [deck, setDeck] = React.useState(null)
  const [ttsDeck, setTTS] = React.useState(null)
  const [listings, setListings] = React.useState(null)

  const setTTSDeck = (deck) => {
    setTTS(deck)
  }

  const onError = (msg) => {
    console.log(msg)
  }
  return (
    <Router>
      <Header
        deck={deck}
        ttsDeck={ttsDeck}
        setTTSDeck={setTTSDeck}
        setDeck={setDeck}
      />
      <Nav sticky />
      <Switch>
        <Route path="/selling">
          <Selling listings={listings} setListings={setListings} />
        </Route>
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
          />
        </Route>
        <Route path="/buying">
          <Buying sets={sets} />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route exact path="/">
          <Buying sets={sets} />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
