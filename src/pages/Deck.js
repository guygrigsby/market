import React from 'react'
import FetchDeckForm from '../components/FetchDeckForm.js'
//import CardList from '../components/CardList.js'
import CustomCardTable from '../components/CustomCardTable.js'

const Deck = ({ decks, setDecks, ...rest }) => {
  console.log('DeckPage', decks)
  return (
    <>
      <FetchDeckForm decks={decks} setDecks={setDecks} {...rest} />
      {/*
      <CardList deck={deck} setDeck={setDeck} {...rest} />
      */}
      <CustomCardTable decks={decks} />
    </>
  )
}

export default Deck
