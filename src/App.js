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
import { useStore } from './use-store.js'
import { useAuth } from './use-auth'

const App = () => {
  const auth = useAuth()
  const store = useStore()

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
  const [removed, setRemoved] = React.useState([])
  const [added, setAdded] = React.useState([])

  const setTTSDeck = (deck) => {
    setTTS(deck)
  }

  const addCard = (card) => {
    setAdded((prev) => {
      const n = [...prev]
      n.push(card)
      return n
    })
  }
  const removeCard = (card) => {
    setRemoved((prev) => {
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
    if (added.length > 0) {
      store.writeCardsToCollection(auth.user, [...added])
      setAdded([])
    }
    if (removed.length > 0) {
      store.removeCardsFromCollection(auth.user, [...removed])
      setRemoved([])
    }
  }, [added, removed])

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
          <Selling addCard={addCard} removeCard={removeCard} />
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
