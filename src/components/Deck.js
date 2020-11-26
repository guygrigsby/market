import React from 'react'
import Card from './Card.js'
import { cx, css } from 'pretty-lights'

const cardClass = (z, overlap) => {
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
const Deck = ({
  overlap = true,
  deck,
  cname,
  ttsDeck,
  setTTSDeck,
  setDeck,
  setSelected,
}) => {
  return deck.map((e, i) => {
    return (
      <span className={cx(cname, cardClass)}>
        <Card
          onClick={() => setSelected(e)}
          card={e}
          cl={cx(cname, cardClass(i, overlap))}
          key={i}
        />
      </span>
    )
  })
}

export default Deck
