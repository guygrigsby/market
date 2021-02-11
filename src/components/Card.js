import React from 'react'
import { cx, css } from 'pretty-lights'
import flipIcon from '../images/flip.svg'
const cardImageClass = css`
  max-width: 100%;
  height: auto;
`
const cardClass = css`
  flex: 1 1 auto;
  overflow: visible;
`
const flip = css`
  display: inline-block;
  position: relative;
  height: auto;
  width: auto;
`
const flipper = css`
  position: absolute;
  bottom: 8%;
  right: 10%;
  height: 10%;
  width: 20%;
  background-image: url(${flipIcon});
`

const box = css`
  height: 100%;
  width: auto;
`
const Card = ({ onClick, size, card, cl, onError }) => {
  const [flipped, setFlipped] = React.useState(false)
  const [imageSource, setImageSource] = React.useState()

  const toggleFlipped = (e) => {
    setFlipped(!flipped)
    e.stopPropagation()
  }

  const doubleSided = card.card_faces

  React.useEffect(() => {
    let images
    if (doubleSided) {
      if (flipped) {
        images = card.card_faces[1].image_uris
      } else {
        images = card.card_faces[0].image_uris
      }
    } else {
      images = card.image_uris
    }
    if (!images) {
      onError('No image found.')
      return
    }
    let src
    switch (size) {
      case 0:
        src = images.small
        break
      case 1:
        src = images.png
        break
      case 2:
        src = images.large
        break
      default:
        src = images.small
        break
    }

    setImageSource(src)
  }, [size, card, flipped, doubleSided, setImageSource, onError])

  return (
    <div className={cx(cl, cardClass)} onClick={onClick}>
      <div className={doubleSided ? flip : box}>
        {doubleSided ? (
          <div className={flipper} onClick={toggleFlipped}></div>
        ) : null}
        <img className={cardImageClass} src={imageSource} alt={card.name} />
      </div>
    </div>
  )
}
export default Card
