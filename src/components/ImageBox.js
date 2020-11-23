import React from 'react'
import ImageChooser from './ImageChooser'
import Card from './Card.js'
import { cx, css } from 'pretty-lights'

const box = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: stretch;
  align-items: flex-start;
  overflow-x: scroll;
`
const card = (z, overlap) => {
  return css`
    flex: 1 1 auto;
    height: ${overlap ? '50px' : 'auto'};
    z-index: ${z};
    overflow: visible;
    transition: all 0.15s ease-in-out;
    ${overlap
      ? `&:hover {
      z-index: 999;
      overflow: visible;
      transform: scale(101%);
    }`
      : `&:hover {
      transform: scale(101%);
    }`}
  `
}
const ImageBox = ({
  overlap = true,
  chooserModal = false,
  onSelect,
  onChooserSelect,
  deck,
  cname,
}) => {
  const [selected, setSelected] = React.useState(false)
  const onNestedSelect = (newC) => {
    onChooserSelect(newC, selected)
  }
  return (
    <div className={cx(box, cname)}>
      {chooserModal && selected ? (
        <ImageChooser
          onCardSelect={onNestedSelect}
          onClose={() => setSelected(false)}
          cardName={selected}
        />
      ) : null}
      {deck ? (
        deck.map((e, i) => {
          return (
            <span
              className={card(i + 1, overlap)}
              onClick={() => {
                return setSelected(e.name)
              }}
              key={i}
            >
              <Card card={e} />
            </span>
          )
        })
      ) : (
        <div className={cname} />
      )}
    </div>
  )
}

export default ImageBox
