import React from 'react'
import { searchForCard } from '../services/scryfall.js'
import './ImageChooser.css'
import ImageBox from './ImageBox.js'
import { cx, css } from 'pretty-lights'

const imageBoxClass = css`
  height: 50%;
`

const imgBox = css`
  margin: 5%;
`

const ImageChooser = ({ onCardSelect, cardName, onClose }) => {
  const [cards, setCards] = React.useState()
  React.useEffect(() => {
    const f = async () => {
      const others = await searchForCard(cardName)
      setCards(others.data)
    }
    f()
  })
  return (
    <div id="myModal" className={cx('modal', imageBoxClass)} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span onClick={onClose} className="close">
          &times;
        </span>
        {cards ? (
          <ImageBox
            onCardSelect={onCardSelect}
            cname={imgBox}
            chooserModal={false}
            overlap={false}
            deck={cards}
          />
        ) : null}
      </div>
    </div>
  )
}

export default ImageChooser
