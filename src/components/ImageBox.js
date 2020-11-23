import React from 'react'
import ImageChooser from './ImageChooser'
import Card from './Card.js'
import { cx, css } from 'pretty-lights'
import { naive, updateTTS } from '../services/replace.js'

const box = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: stretch;
  align-items: flex-start;
  overflow-x: scroll;
`
const card = (z, overlap) => {
  return css`
    flex: 1 1 auto;
    height: ${overlap ? '50px' : 'auto'};
    z-index: ${z};
    overflow: visible;
    transition: all 0.15s ease-in-out;
    ${overlap
      ? `&:hover {
      z-index: 999;
      overflow: visible;
      transform: scale(101%);
    }`
      : `&:hover {
      transform: scale(101%);
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
    console.log('replacing', oldC, 'with', newC)
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
            <span
              className={card(i + 1, overlap)}
              onClick={() => setSelected(e)}
              key={i}
            >
              <Card card={e} />
            </span>
          )
        })
      ) : (
        <div className={cname} />
      )}
    </div>
  )
}

export default ImageBox
