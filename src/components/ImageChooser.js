import React from 'react'
import { searchForCard } from '../services/scryfall.js'
import './ImageChooser.css'
import { css } from 'pretty-lights'
import Card from './Card'
const card = (z, overlap = true) => {
  return css`
    height: ${overlap ? '6em' : 'auto'};
    z-index: ${z};
    overflow: visible;
    margin: 1em;
    transition: all 0.15s ease-in-out;
    ${overlap
      ? `&:hover {
      z-index: ${z + 20};
  cursor: pointer;
    }`
      : `&:hover {
  cursor: pointer;
    }`}
  `
}
const ImageChooser = ({ cards, setCards, onClick, currentCard, onClose }) => {
  React.useEffect(() => {
    const f = async () => {
      const others = await searchForCard(currentCard.name)
      console.log('getting matching cards', currentCard, others)
      setCards(others)
    }
    f()
  }, [currentCard, cards, setCards])
  console.log('rendering ImageChooser', cards)
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content">
        <span onClick={onClose} className="close">
          &times;
        </span>
        {cards ? (
          cards.map((e, i) => {
            return (
              <Card
                card={e}
                size={1}
                key={i}
                cl={card(cards.length - i, true)}
                onClick={() => onClick(e, currentCard)}
              />
            )
          })
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}

export default ImageChooser
