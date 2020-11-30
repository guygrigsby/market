import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import Header from './components/Header.js'
import Nav from './components/Nav.js'
import Home from './pages/Home.js'
import Deck from './pages/Deck.js'
import Selling from './pages/Selling.js'
import LoginPage from './pages/Login.js'
import { listItem } from './services/list.js'
import { writeCardsToCollection, removeCardsFromCollection } from './store.js'
import { useAuth } from './use-auth'

const App = () => {
  const auth = useAuth()

  const menu = [
    {
      link: '/decks',
      content: 'Deck Building',
    },
    {
      link: '/selling',
      content: 'Selling',
      authRequired: true,
    },
    {
      link: '/singles',
      content: 'Singles',
    },
    {
      link: '/about',
      content: 'About',
    },
  ]
  const [deckName, setDeckName] = React.useState('')
  const [deck, setDeck] = React.useState(null)
  const [ttsDeck, setTTS] = React.useState(null)
  const [cards, setCards] = React.useState([])
  const [removed, setRemoved] = React.useState([])
  const [added, setAdded] = React.useState([])

  const setTTSDeck = (deck) => {
    setTTS(deck)
  }

  const addCard = (card) => {
    listItem(auth, card)
  }
  const removeCard = (card) => {
    setCards((prev) => {
      var index = prev.indexOf(card)
      const m = prev
      if (index !== -1) {
        const m = [...prev]
        m.splice(index, 1)
      }
      return m
    })
  }

  React.useEffect(() => {
    if (added.size > 0) {
      writeCardsToCollection(auth, added)
      setAdded(new Map())
    }
    if (removed.size > 0) {
      removeCardsFromCollection(auth, removed)
      setRemoved(new Map())
    }
  }, [added, removed, auth])

  return (
    <Router>
      <Header
        deck={deck}
        ttsDeck={ttsDeck}
        setTTSDeck={setTTSDeck}
        setDeck={setDeck}
      />
      <Nav items={menu} />
      <Switch>
        <Route path="/selling">
          <Selling cards={cards} addCard={addCard} removeCard={removeCard} />
        </Route>
        <Route path="/decks">
          <Deck
            deckName={deckName}
            setDeckName={setDeckName}
            deck={deck}
            ttsDeck={ttsDeck}
            setDeck={setDeck}
            setTTSDeck={setTTSDeck}
          />
        </Route>
        <Route path="/login">
          {auth.user ? <Redirect to="/selling" /> : <LoginPage />}
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
