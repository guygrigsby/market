import React from 'react'
import ImageChooser from './ImageChooser'
import Card from './Card.js'
import { cx, css } from 'pretty-lights'
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
  selected,
  setSelected,
  alternateCards,
  setAlternateCards,
  update,
}) => {
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
