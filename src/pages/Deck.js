import React from 'react'
import FetchDeckForm from '../components/FetchDeckForm.js'
import CardList from '../components/CardList'
const Deck = ({ deck, ttsDeck, setDeck, setTTSDeck, ...rest }) => {
  return (
    <>
      <FetchDeckForm
        deck={deck}
        ttsDeck={ttsDeck}
        setTTSDeck={setTTSDeck}
        setDeck={setDeck}
        {...rest}
      />
      <CardList cards={deck} />
    </>
  )
}

export default Deck
