import React from 'react'
import Autocomplete from 'react-autocomplete'

const AsyncAutoComplete = ({ open, handleKeyPress, setCardName, ...rest }) => {
  const [cards, setCards] = React.useState([])
  const [cardLocal, setCardLocal] = React.useState('')

  const aulist = async (name) => {
    setCardLocal(name)
    if (name.length < 3) return
    const fullURI = new URL(
      `https://api.scryfall.com/cards/autocomplete?q=${name}`,
    )
    fetch(fullURI)
      .then(async (response) => await response.json())
      .then((data) => {
        setCards([...data.data])
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  return (
    <Autocomplete
      getItemValue={(item) => item}
      items={cards}
      renderItem={(item, isHighlighted) => (
        <div
          key={item}
          style={{ background: isHighlighted ? 'lightgray' : 'white' }}
        >
          {item}
        </div>
      )}
      value={cardLocal}
      onChange={(e) => aulist(e.target.value)}
      onSelect={(val) => {
        console.log('value', val)
        setCardName(val)
        setCardLocal(val)
      }}
      {...rest}
    />
  )
}
export default AsyncAutoComplete
