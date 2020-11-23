import React from 'react'
import { searchForCard } from '../services/scryfall.js'
import './ImageChooser.css'
import { cx, css } from 'pretty-lights'

const card = (z) => {
  return css`
    margin: 1em;
    z-index: ${z};
    transition: all 0.15s ease-in-out;
    &:hover {
      transform: scale(101%);
    }
  `
}
const imageBoxClass = css`
  height: 50%;
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
    <div id="myModal" className={cx('modal', imageBoxClass)} onClick={onClose}>
      <div className="modal-content">
        <span onClick={onClose} className="close">
          &times;
        </span>
        {cards ? (
          cards.map((e, i) => {
            return (
              <img
                key={i}
                className={card(i + 1)}
                onClick={() => onClick(e, currentCard)}
                width="40%"
                src={e.image_uris.normal}
                alt={e.name}
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
