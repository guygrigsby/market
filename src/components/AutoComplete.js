import React from 'react'
import Autocomplete from 'react-autocomplete'
import { css } from 'pretty-lights'

const style = css`
  z-offset: 2;
  font-size: 1 em;
  padding: 0.5em;
`

const AsyncAutoComplete = ({ open, handleKeyPress, setCardName, ...rest }) => {
  const [cards, setCards] = React.useState([])
  const [cardLocal, setCardLocal] = React.useState('')

  React.useEffect(() => {
    if (cardLocal.length < 3) return
    const aulist = async () => {
      const fullURI = new URL(
        `https://api.scryfall.com/cards/autocomplete?q=${cardLocal}`,
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
  }, [cardLocal])

  return (
    <Autocomplete
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
      value={cardLocal}
      onChange={(e) => {
        if (e.target.value === '') {
          setCardName(null)
        }
        setCardLocal(e.target.value)
      }}
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
