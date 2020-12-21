import React from 'react'
import { searchForCard } from '../services/scryfall.js'
import './ImageChooser.css'
import { css } from 'pretty-lights'
import Card from './Card'
const card = (z) => {
  return css`
    height: '5em'};
    max-width: 50%;
    z-index: ${z};
    overflow: visible;
    margin: 1em;
    transition: all 0.15s ease-in-out;
       &:hover {
      z-index: ${z + 100};
      cursor: pointer;
    `
}
const ImageChooser = ({
  cards,
  setCards,
  onClick,
  currentCard,
  setCurrentCard,
  onClose,
}) => {
  React.useEffect(() => {
    if (cards && cards.length > 0 && cards[0].name === currentCard.name) return
    const f = async () => {
      const others = await searchForCard(currentCard.name)
      setCards(others)
    }
    f()
  }, [currentCard, cards, setCards])

  const handleEscape = (event) => {
    if (event.keyCode === 27) {
      handleClose()
    }
  }

  React.useEffect(() => {
    document.addEventListener('keydown', handleEscape, false)

    return () => {
      document.removeEventListener('keydown', handleEscape, false)
    }
  })

  const handleClose = () => {
    setCards(null)
    setCurrentCard(false)
    onClose()
  }
  const handleCardClick = (newCard) => {
    setCards(null)
    onClick(newCard, currentCard)
    setCurrentCard(false)
  }
  return (
    <div className="cardmodal" onClick={handleClose}>
      <span onClick={onClose} className="close">
        &times;
      </span>
      <div className="cardmodal-content">
        {cards ? (
          cards.map((e, i) => {
            return (
              <Card
                card={e}
                size={1}
                key={i}
                cl={card(cards.length - i, true)}
                onClick={() => handleCardClick(e)}
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
