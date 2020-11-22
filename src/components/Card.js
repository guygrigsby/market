import React from 'react'

const Card = ({ card }) => {
  console.log('incoming card', card)
  const [flipped, setFlipped] = React.useState(false)
  const [imageSource, setImageSource] = React.useState(card.image_uris.small)
  const toggleFlipped = (e) => {
    setFlipped(!flipped)
    e.stopPropagation()
  }

  React.useEffect(() => {
    if (card.card_faces) {
      if (flipped) {
        setImageSource(card.card_faces[1].image_uris.small)
      } else {
        setImageSource(card.card_faces[0].image_uris.small)
      }
    } else {
      setImageSource(card.image_uris.small)
    }
  }, [card, flipped])
  return (
    <span>
      <img width="auto" src={imageSource} alt={card.name} />
    </span>
  )
}
export default Card
