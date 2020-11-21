import React from 'react'
import FetchDeckForm from '../components/FetchDeckForm.js'
import CardList from '../components/CardList'
import { cx, css } from 'pretty-lights'
import ImageBox from '../components/ImageBox.js'
const box = css`
  display: flex;
  width: 100%;
  height: 100%;
`

const w50 = css`
  width: 50%;
`
const bg = css`
  width: 50%;
  background-color: lightgray;
`

const Deck = ({ deck, ttsDeck, setDeck, setTTSDeck, ...rest }) => {
  const replaceCard = (newC, oldC) => {
    const nd = [...deck]
    for (let i = deck.length / 2; ; ) {
      if (deck[i].name === oldC.name) {
        nd.splice(i, 1)
        break
      }
      if (deck[i].name > oldC.name) {
        i = (deck.length - i) / 2 + i
      } else {
        i = i - (deck.length - i) / 2
      }
    }
    let prev = deck.length / 2
    for (let i = prev; ; ) {
      if (i === prev || Math.abs(i - prev) === 1) {
        nd.splice(i, 0, newC)
        break
      }
      if (deck[i].name > oldC.name) {
        i = (deck.length - i) / 2 + i
      } else {
        i = i - (deck.length - i) / 2
      }
      prev = i
    }
  }
  return (
    <>
      <FetchDeckForm
        deck={deck}
        ttsDeck={ttsDeck}
        setTTSDeck={setTTSDeck}
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
