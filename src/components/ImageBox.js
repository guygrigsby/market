import React from 'react'
import Card from './Card.js'
import { cx, css } from 'pretty-lights'

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
const ImageBox = ({ overlap = true, deck, classes, setSelected }) => {
  return (
    <div className={cx('image-box', classes)}>
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
