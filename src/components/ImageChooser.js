import React from 'react'
import { searchForCard } from '../services/scryfall.js'
import './ImageChooser.css'
import { css } from 'pretty-lights'
import Card from './Card'
const card = (z, overlap = true) => {
  return css`
    height: ${overlap ? '75px' : 'auto'};
    z-index: ${z};
    overflow: visible;
    margin: 1em;
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
const box = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
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
                  cl={card(i + 1, false)}
                  onClick={() => onClick(e, currentCard)}
                  width={'33%'}
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
