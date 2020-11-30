import React from 'react'
import Autocomplete from 'react-autocomplete'
import { css } from 'pretty-lights'

const style = css`
  z-offset: 100;
  position: fixed
  font-size: 1 em;
  padding: 0.5em;
`
const onTop = css`
  font-size: 1 em;
`

const AsyncAutoComplete = ({ open, handleKeyPress, setCardName }) => {
  const [cards, setCards] = React.useState([])
  const [currentValue, setCurrentValue] = React.useState('')

  React.useEffect(() => {
    if (currentValue.length < 3) return
    const aulist = async () => {
      const fullURI = new URL(
        `https://api.scryfall.com/cards/autocomplete?q=${currentValue}`,
      )
      fetch(fullURI)
        .then(async (response) => await response.json())
        .then((data) => {
          setCards(data.data)
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }
    aulist()
  }, [currentValue])

  return (
    <Autocomplete
      menuStyle={{ position: 'fixed', zIndex: 100 }}
      className={onTop}
      getItemValue={(item) => item}
      items={cards}
      renderItem={(item, isHighlighted) => (
        <div
          className={style}
          key={item}
          style={{ background: isHighlighted ? 'lightgray' : 'white' }}
        >
          {item}
        </div>
      )}
      value={currentValue}
      onChange={(e) => {
        setCurrentValue(e.target.value)
      }}
      onSelect={(val) => {
        setCardName(val)
        setCurrentValue(val)
      }}
    />
  )
}
export default AsyncAutoComplete
