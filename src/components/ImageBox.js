import React from 'react'
import ImageChooser from './ImageChooser'
import Card from './Card.js'
import { cx, css } from 'pretty-lights'
import { naive, updateTTS } from '../services/replace.js'

const box = css`
  display: flex;
  flex-wrap: wrap;
  overflow-x: scroll;
`
const card = (z, overlap) => {
  return css`
    height: ${overlap ? '50px' : 'auto'};
    z-index: ${z};
    overflow: visible;
    transition: all 0.15s ease-in-out;
    ${overlap
      ? `&:hover {
      z-index: ${z + 20};
      transform: scale(105%);
    }`
      : `&:hover {
      transform: scale(105%);
    }`}
  `
}
const ImageBox = ({
  overlap = true,
  chooserModal = false,
  deck,
  cname,
  ttsDeck,
  setTTSDeck,
  setDeck,
}) => {
  const [selected, setSelected] = React.useState(false)

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
    <div className={cx(box, cname)}>
      {chooserModal && selected ? (
        <ImageChooser
          onClick={(newCard, oldCard) => {
            update(newCard, oldCard)
          }}
          onClose={() => setSelected(false)}
          currentCard={selected}
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
        <div className={cname} />
      )}
    </div>
  )
}

export default ImageBox
