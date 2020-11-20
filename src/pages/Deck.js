import React from 'react'
import FetchDeckForm from '../components/FetchDeckForm.js'
//import CardList from '../components/CardList.js'
import CustomCardTable from '../components/CustomCardTable.js'

const imageFormatter = (cell, row, rowIndex) => {
  return (
    <img
      key={`${rowIndex}-${row.name}`}
      src={row.image_uris.small}
      alt="card"
    ></img>
  )
}
const columns = [
  {
    dataField: 'image_uris.small',
    text: 'Image',
    formatter: (cell, row, rowIndex) => {
      console.log('cell', cell)
      return imageFormatter(cell, row, rowIndex)
    },
  },
  {
    dataField: 'name',
    text: 'Name',
    sort: true,
  },
  {
    dataField: 'set',
    text: 'Set',
    sort: true,
  },
  {
    dataField: 'cmc',
    text: 'Cmc',
    sort: true,
  },
  {
    dataField: 'cost',
    text: 'Cost',
  },
  {
    dataField: 'rarity',
    text: 'Rarity',
    sort: true,
  },
]

const Deck = ({ decks, setDecks, ...rest }) => {
  console.log('DeckPage', decks)
  return (
    <>
      <FetchDeckForm decks={decks} setDecks={setDecks} {...rest} />
      {/*
      <CardList deck={deck} setDeck={setDeck} {...rest} />
      */}
      {decks && decks.internal && (
        <CustomCardTable decks={decks.internal} columns={columns} />
      )}
    </>
  )
}

export default Deck
