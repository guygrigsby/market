import React from 'react'
import FetchDeckForm from '../components/FetchDeckForm.js'
import CardList from '../components/CardList'
import { cx, css } from 'pretty-lights'
import ImageBox from '../components/ImageBox.js'
import { naive, updateTTS } from '../services/replace.js'
import ImageChooser from '../components/ImageChooser'
import Loader from '../components/Loader'
import '../components/ImageChooser.css'
import './Deck.css'

const manaSymbols = [
  'ms ms-w', //white
  'ms ms-u', // blue
  'ms ms-b', // black
  'ms ms-r', // red
  'ms ms-g', // green
  'ms ms-s', // snow
  'ms ms-p', // phrex pig
]

const rm = css`
  margin-right: 5px;
`

const randomManaSymbol = () =>
  cx(manaSymbols[Math.floor(Math.random() * manaSymbols.length)], rm)

const li = (txt) => {
  const lineItem = css`
    padding: 0.25em;
    font-size: 16px;
    display: flex;
    align-items: baseline;
  `
  return (
    <li className={lineItem}>
      <i className={`${randomManaSymbol()} ms-cost ms-shadow`}></i>
      {` ${txt}`}
    </li>
  )
}

const list = css`
  list-style-type: none;
`
const width = (w) =>
  css`
    width: ${w}%;
  `

const motd = css`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const pageTop = css`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`
const page = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`
const box = css`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: visible;
`
const newsHeader = css`
  padding: 1em 0 0 1em;
  font-size: 20px;
  font-weight: 700;
  line-height: 20px;
`
const formSection = css`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`

const Deck = ({
  deckName,
  setDeckName,
  deck,
  ttsDeck,
  setDeck,
  setTTSDeck,
  onError,
  setLoading,
  loading,
  ...rest
}) => {
  const [selected, setSelected] = React.useState(false)
  const [alternateCards, setAlternateCards] = React.useState()
  const [exportCSV, setExportCSV] = React.useState()

  const update = async (oldC, newC) => {
    if (!oldC || !newC) return
    setDeck((prev) => {
      if (prev) {
        return naive(prev, oldC, newC)
      }
      return naive(deck, oldC, newC)
    })
    setTTSDeck((prev) => {
      if (prev) {
        return updateTTS(prev, oldC, newC)
      }
      return updateTTS(ttsDeck, oldC, newC)
    })
    setSelected(false)
  }
  return (
    <div className={page}>
      <div className={pageTop}>
        <div className={formSection}>
          <FetchDeckForm
            deckName={deckName}
            setDeckName={setDeckName}
            deck={deck}
            setLoading={setLoading}
            ttsDeck={ttsDeck}
            setDeck={setDeck}
            setTTSDeck={setTTSDeck}
            exportCSV={exportCSV}
            onError={onError}
            {...rest}
          />
          {loading && <Loader />}
        </div>
        <div className={motd}>
          <div className={newsHeader}>News</div>
          <ul className={list}>
            {li('Cards are all up to date for Kaldheim.')}
            {li(
              'We are having issues with some multi-faced cards. It is known.',
            )}
          </ul>
        </div>
      </div>
      {selected ? (
        <ImageChooser
          onClick={(newCard, oldCard) => {
            update(newCard, oldCard)
            setAlternateCards(null)
            setSelected(false)
          }}
          onClose={() => setSelected(false) && setAlternateCards(null)}
          currentCard={selected}
          setCurrentCard={setSelected}
          setCards={setAlternateCards}
          cards={alternateCards}
          onError={onError}
        />
      ) : null}
      {deck && (
        <div className={box}>
          <div className={width(30)}>
            <ImageBox
              deck={deck}
              dark={false}
              setSelected={setSelected}
              onError={onError}
            />
          </div>
          <div className={width(70)}>
            <CardList
              setExportCSV={setExportCSV}
              setSelected={setSelected}
              name={deckName}
              cards={deck}
              onError={onError}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Deck
