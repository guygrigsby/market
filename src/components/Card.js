import React from 'react'

const Card = ({ card }) => {
  const [flipped, setFlipped] = React.useState(false)
  const toggleFlipped = () => {
    setFlipped(!flipped)
  }

  const doubleSided = (e) => {
    return e.card_faces !== null
  }
  const front = (e) => {
    console.log('double sided', e)
    const faces = e.card_faces[0]
    console.log('double sided faces', faces)
    const front = faces.image_uris
    console.log('double sided front', front)
    const im = front.small
    console.log('double sided front im', im)
    return <img width="auto" src={im} alt={e.name} />
  }
  const back = (e) => {
    console.log('double sided', e)
    const faces = e.card_faces[1]
    console.log('double sided faces', faces)
    const front = faces.image_uris
    console.log('double sided front', front)
    const im = front.small
    console.log('double sided front im', im)
    return <img width="auto" src={im} alt={e.name} />
  }
  return (
    <span>
      <img
        width="auto"
        src={
          doubleSided(card)
            ? flipped
              ? back(card)
              : front(card)
            : card.image_uris.small
        }
        alt={card.name}
      />
    </span>
  )
}
export default Card
