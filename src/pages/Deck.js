import React from 'react'
import FetchDeckForm from '../components/FetchDeckForm.js'
import CardList from '../components/CardList'
import { useWindowDimensions } from '../components/use-window-dimensions.js'
import { css } from 'pretty-lights'
import ImageBox from '../components/ImageBox.js'
import { naive, updateTTS } from '../services/replace.js'
import ImageChooser from '../components/ImageChooser'
import '../components/ImageChooser.css'
import '../components/ImageChooser.js'
import './Deck.css'
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
const tabs = css`
  display: flex;
  color: white;
  width: 100%;
  height: 100%;
  overflow: visible;
`

const Deck = ({
  deckName,
  setDeckName,
  deck,
  ttsDeck,
  setDeck,
  setTTSDeck,
  onError,
  ...rest
}) => {
  const [loading, setLoading] = React.useState(false)
  const [visible, setVisible] = React.useState(0)
  const [selected, setSelected] = React.useState(false)
  const [alternateCards, setAlternateCards] = React.useState()
  const [exportCSV, setExportCSV] = React.useState()
  const size = useWindowDimensions()
  const small = size.width < 768
  const col30 = () => css`
    width: ${small ? (visible === 0 ? '100%' : '0') : '30%'};
    margin-left: 1em;
  `
  const col70 = () => css`
    width: ${small ? (visible === 1 ? '100%' : '0') : '70%'};
    margin-right: 1em;
  `
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
      <FetchDeckForm
        deckName={deckName}
        setDeckName={setDeckName}
        deck={deck}
        setLoading={setLoading}
        ttsDeck={ttsDeck}
        setDeck={setDeck}
        setTTSDeck={setTTSDeck}
        exportCSV={exportCSV}
        {...rest}
      />

      {size.width < 786 ? (
        <div className="tab-menu">
          <div>
            <button className="tab-button" onClick={() => setVisible(0)}>
              Images
            </button>
            <button className="tab-button" onClick={() => setVisible(1)}>
              List
            </button>
          </div>
        </div>
      ) : null}
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
        />
      ) : null}
      {deck && (
        <div className={small ? tabs : box}>
          <div className={col30()}>
            <ImageBox
              deck={deck}
              dark={small ? true : false}
              setSelected={setSelected}
            />
          </div>
          <div className={col70()}>
            <CardList
              setExportCSV={setExportCSV}
              loading={loading}
              setSelected={setSelected}
              name={deckName}
              cards={deck}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Deck
