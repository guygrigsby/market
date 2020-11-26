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
const ImageChooser = ({ onClick, currentCard, onClose }) => {
  const [cards, setCards] = React.useState()

  React.useEffect(() => {
    const f = async () => {
      const others = await searchForCard(currentCard.name)
      setCards(others.data)
    }
    f()
  }, [currentCard])
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content">
        <span onClick={onClose} className="close">
          &times;
        </span>
        <span className={box}>
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
        </span>
      </div>
    </div>
  )
}

export default ImageChooser
