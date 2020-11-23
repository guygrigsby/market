import React from 'react'
import { css } from 'pretty-lights'

const overlay = (ref) => css`
  position: fixed;
`

const Card = ({ card }) => {
  const [flipped, setFlipped] = React.useState(false)
  const [imageSource, setImageSource] = React.useState(card.image_uris.small)
  const toggleFlipped = (e) => {
    setFlipped(!flipped)
    e.stopPropagation()
  }

  const ref = React.createRef()

  const doubleSided = card.card_faces

  React.useEffect(() => {
    if (doubleSided) {
      if (flipped) {
        setImageSource(card.card_faces[1].image_uris.small)
      } else {
        setImageSource(card.card_faces[0].image_uris.small)
      }
    } else {
      setImageSource(card.image_uris.small)
    }
  }, [card, flipped, doubleSided, setImageSource])

  return (
    <span ref={ref}>
      {doubleSided && <span className={overlay(ref)}>FLIP</span>}
      <img width="auto" src={imageSource} alt={card.name} />
    </span>
  )
}
export default Card
