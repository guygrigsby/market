import React from 'react'
import FetchDeckForm from '../components/FetchDeckForm.js'
import CardList from '../components/CardList'
import { useWindowDimensions } from '../components/use-window-dimensions.js'
import { css } from 'pretty-lights'
import ImageBox from '../components/ImageBox.js'
import './Deck.css'
const page = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
`
const box = css`
  display: flex;
  width: 100%;
  height: 100%;
`
const tabs = css`
  display: flex;
  color: white;
  width: 100%;
  height: 100%;
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
  const size = useWindowDimensions()
  const small = size.width < 768
  const col30 = () => css`
    width: ${small ? (visible === 0 ? '100%' : '0') : '30%'};
  `
  const col70 = () => css`
    width: ${small ? (visible === 1 ? '100%' : '0') : '70%'};
  `
  const pageHeader = css`
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 0.5em;
    margin: 0.5em;
  `
  return (
    <div className={page}>
      <div className={pageHeader}>
        <FetchDeckForm
          deckName={deckName}
          setDeckName={setDeckName}
          deck={deck}
          setLoading={setLoading}
          ttsDeck={ttsDeck}
          setDeck={setDeck}
          setTTSDeck={setTTSDeck}
          {...rest}
        />
      </div>

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
      {deck && (
        <div className={small ? tabs : box}>
          <div className={col30()}>
            <ImageBox
              deck={deck}
              loading={loading}
              chooserModal={true}
              ttsDeck={ttsDeck}
              setTTSDeck={setTTSDeck}
              setDeck={setDeck}
              dark={small ? true : false}
            />
          </div>
          <div className={col70()}>
            <CardList name={deckName} cards={deck} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Deck
