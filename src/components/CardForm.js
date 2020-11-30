import React from 'react'
import AsyncAutoComplete from './AutoComplete'
import { css } from 'pretty-lights'
import PropTypes from 'prop-types'
import { searchForCard } from '../services/scryfall.js'
import { useSets } from '../use-sets'
import Select from 'react-select/async'

const setCell = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8em;
`
const logoClass = css`
  padding-right: 7px;
`

const setSelectClass = css`
  min-width: 300px;
`
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

const CardForm = ({ addCard, removeCard }) => {
  const [card, setCard] = React.useState({})
  const [condition, setCondition] = React.useState()
  const [price, setPrice] = React.useState(0)
  const [cardName, setCardName] = React.useState('')

  const allSets = useSets()

  const setCardVersion = (card) => {
    setCard(card)
    setPrice(card.prices.usd)
  }

  const handleSubmit = (e) => {
    if (!card) toast('No card')
    if (!condition) toast('No condition')
    if (!price) toast('No price')
    const listing = {
      card,
      condition,
      price,
    }
    addCard(listing)
    e.preventDefault()
    return () => {
      clear()
    }
  }

  const clear = () => {
    setCard({})
    setCondition('')
    setPrice(0)
  }

  return (
    <form className={box} onSubmit={(e) => handleSubmit(e)}>
      <div className={entry}>
        <label>Card Name</label>
        <AsyncAutoComplete setCardName={setCardName} />
      </div>
      <div className={entry}>
        <label>Set</label>

        <Select
          className={setSelectClass}
          onChange={(val) => setCardVersion(val)}
d         getOptionValue={(v) => {
            return v.code
          }}
          getOptionLabel={(v) => {
            return (
              <div className={setCell}>
                <span style={{ marginRight: '.5em' }}>{v.name}</span>
                <img
                  className={logoClass}
                  src={v.icon_svg_uri}
                  alt={`${v.name} logo`}
                  height="15px"
                />
              </div>
            )
          }}
          loadOptions={() => searchForCard(cardName)}
          defaultOptions={Array.from(allSets.values())}
          theme={selectTheme}
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
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <button type="submit">Add</button>
    </form>
  )
}

const customStyles = {
  input: (provided, state) => ({
    ...provided,
  }),
}
CardForm.propTypes = {
  sets: PropTypes.instanceOf(Map).isRequired,
  addCard: PropTypes.func,
  removeCard: PropTypes.func,
}
export default CardForm
