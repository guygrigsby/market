import React from 'react'
import { searchForCard } from '../services/scryfall.js'
import './ImageChooser.css'
import { css } from 'pretty-lights'
import Card from './Card'
const card = (z, overlap = true) => {
  return css`
    height: ${overlap ? '50px' : 'auto'};
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
const box = css`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row-reverse;
  justify-content: flex-end;
  overflow: auto;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
`
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
        <span className={box}>
          {cards ? (
            cards.map((e, i) => {
              console.log('card', card)
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
        </span>
      </div>
    </div>
  )
}

export default ImageChooser
