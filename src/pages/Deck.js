import React from 'react'
import FetchDeckForm from '../components/FetchDeckForm.js'
import CardList from '../components/CardList'
import { css } from 'pretty-lights'
import ImageBox from '../components/ImageBox.js'
import { naive } from '../services/replace.js'
const box = css`
  display: flex;
  width: 100%;
  height: 100%;
`

const w50 = css`
  width: 50%;
`

const Deck = ({ deck, ttsDeck, setDeck, setTTSDeck, ...rest }) => {
  const replaceCard = (newC, oldC) => {
    setDeck(naive(deck, newC, oldC))
  }

  React.useEffect(() => {}, [deck])
  return (
    <>
      <FetchDeckForm
        deck={deck}
        ttsDeck={ttsDeck}
        setDeck={setDeck}
        {...rest}
      />
      <div className={box}>
        <ImageBox
          deck={deck}
          cname={w50}
          chooserModal={true}
          onChooserSelect={replaceCard}
        />
        <CardList cards={deck} cname={w50} />
      </div>
    </>
  )
}

export default Deck
