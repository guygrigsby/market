import React from 'react'
import AsyncAutoComplete from './AutoComplete'
import { css } from 'pretty-lights'
import PropTypes from 'prop-types'
import Select from 'react-select'
import SetSelect from './SetSelect'

const entry = css`
  flex: 0 1 200px;
  padding: 10px;
`
const box = css`
  display: flex;
  padding: 12px;
  background-color: #f5f5f5;
  flex-flow: row wrap;
  border: 1px solid grey;
`

const conditionList = [
  { value: 'M', label: 'Mint' },
  { value: 'NM', label: 'Near Mint' },
  { value: 'LP', label: 'Lightly Played' },
  { value: 'MP', label: 'Moderately Played' },
  { value: 'HP', label: 'Heavily Played' },
]

const selectTheme = (theme) => ({
  ...theme,
  borderRadius: '1px',
})

const toast = (msg) => {
  return
}

const CardForm = ({ submitText, addCard, removeCard }) => {
  const [set, setSet] = React.useState(null)
  const [card, setCard] = React.useState(null)
  const [condition, setCondition] = React.useState()
  const [price, setPrice] = React.useState(0)
  const [cardName, setCardName] = React.useState('')

  const handleSubmit = (e) => {
    if (!card) return toast('No card')
    if (!condition) return toast('No condition')
    if (!price) return toast('No price')
    const listing = {
      card,
      condition,
      price,
    }
    addCard(listing)
    clear()
    e.preventDefault()
    e.stopPropagation()
  }

  const clear = () => {
    setCard(null)
    setCardName('')
    setCondition(conditionList[1])
    setPrice(0)
  }

  return (
    <form className={box} onSubmit={(e) => handleSubmit(e)}>
      <div className={entry}>
        <label>Card Name</label>
        <AsyncAutoComplete cardName={cardName} setCardName={setCardName} />
      </div>
      <div className={entry}>
        <label>Set</label>
        <SetSelect
          cardName={cardName}
          onSelect={(val) => {
            setCard(val)
          }}
          selected={set}
          setSelected={setSet}
        />
      </div>
      <div className={entry}>
        <label>Condition</label>
        <Select
          options={conditionList}
          onChange={(val) => setCondition(val)}
          styles={customStyles}
          theme={selectTheme}
        />
      </div>
      <div className={entry}>
        <label>My Price</label>
        <input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <button type="submit" disabled={!card || !condition || price === 0}>
        {submitText}
      </button>
    </form>
  )
}

const customStyles = {
  input: (provided, state) => ({
    ...provided,
  }),
}
CardForm.propTypes = {
  addCard: PropTypes.func,
  removeCard: PropTypes.func,
}
export default CardForm
