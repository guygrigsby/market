import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Header from './components/Header.js'
import Nav from './components/Nav.js'
import Home from './pages/Home.js'
import Deck from './pages/Deck.js'
import Selling from './pages/Selling.js'
import Body from './components/Body.js'
import { writeCardsToCollection, removeCardsFromCollection } from './store.js'
import { useAuth } from './use-auth'
const menu = [
  {
    link: '/decks',
    content: 'Deck Building',
  },
  {
    link: '/selling',
    content: 'Selling',
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

const App = () => {
  const [deck, setDeck] = React.useState(null)
  const [cards, setCards] = React.useState([])
  const [removed, setRemoved] = React.useState([])
  const [added, setAdded] = React.useState([])

  const addCard = (card) => {
    console.log('adding card', card, 'to cards list', cards)
    setCards((prev) => {
      const m = [...prev]
      console.log('prev', prev)
      m.push(card)
      return m
    })
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
  const auth = useAuth()
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
      <Header />
      <Nav items={menu} />
      <Switch>
        <Route path="/selling">
          <Selling cards={cards} addCard={addCard} removeCard={removeCard} />
        </Route>
        <Route path="/decks">
          <Deck deck={deck} setDeck={setDeck} />
        </Route>
        <Route path="/singles">
          <Body>{'singles'}</Body>
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
