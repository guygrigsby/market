import React from 'react'
import ImageChooser from './ImageChooser'
import Card from './Card.js'
import { cx, css } from 'pretty-lights'
import { naive, updateTTS } from '../services/replace.js'
import './ImageChooser.css'

const card = (z, overlap) => {
  return css`
    height: ${overlap ? '50px' : 'auto'};
    z-index: ${z};
    overflow: visible;
    transition: all 0.15s ease-in-out;
    &:hover {
      z-index: ${z + 20};
      transform: scale(102%);
    }}
  `
}
const ImageBox = ({
  overlap = true,
  chooserModal = false,
  deck,
  classes,
  ttsDeck,
  setTTSDeck,
  setDeck,
}) => {
  const [selected, setSelected] = React.useState(false)
  const [alternateCards, setAlternateCards] = React.useState()

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
  }
  return (
    <div className={cx('image-box', classes)}>
      {chooserModal && selected ? (
        <ImageChooser
          onClick={(newCard, oldCard) => {
            update(newCard, oldCard)
            setAlternateCards(null)
          }}
          onClose={() => setSelected(false)}
          currentCard={selected}
          setCards={setAlternateCards}
          cards={alternateCards}
        />
      ) : null}
      {deck ? (
        deck.map((e, i) => {
          return (
            <Card
              onClick={() => setSelected(e)}
              card={e}
              cl={card(i, overlap)}
              key={i}
            />
          )
        })
      ) : (
        <div className={classes} />
      )}
    </div>
  )
}

export default ImageBox
