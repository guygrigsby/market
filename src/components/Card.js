import React from 'react'
import { cx, css } from 'pretty-lights'
const cardClass = css`
  flex: 1 1 auto;
  overflow: visible;
`
const Card = ({ size, card, cl, ...rest }) => {
  const [flipped, setFlipped] = React.useState(false)
  const [imageSource, setImageSource] = React.useState()

  // const toggleFlipped = (e) => {
  //   setFlipped(!flipped)
  //   e.stopPropagation()
  // }
  //

  const ref = React.createRef()

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
    let src
    switch (size) {
      case 0:
        src = images.small
        break
      case 1:
        src = images.normal
        break
      case 2:
        src = images.large
        break
      default:
        src = images.small
        break
    }

    setImageSource(src)
  }, [size, card, flipped, doubleSided, setImageSource, ref])

  return (
    <span ref={ref} className={cx(cl, cardClass)} {...rest}>
      {/*doubleSided && <span onClick={toggleFlipped} />*/}
      <img src={imageSource} alt={card.name} />
    </span>
  )
}
export default Card
