import React from 'react'
import { css } from 'pretty-lights'
import PropTypes from 'prop-types'
import Select from 'react-select'
import CardChooser from './CardChooser'

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

const CardForm = ({ sets, addCard, removeCard }) => {
  const [matches, setMatches] = React.useState([])
  const [card, setCard] = React.useState({})
  const [filteredSets, setFilteredSets] = React.useState([])
  const [condition, setCondition] = React.useState()
  const [price, setPrice] = React.useState(0)

  const setCardVersion = (set) => {
    for (let i = 0; i < matches.length; i++) {
      const card = matches[i]
      if (card.set === set.code) {
        console.log('found exact card', set, card)
        setCard(card)
        setPrice(card.prices.usd)
        return
      }
    }
  }

  const handleSubmit = (e) => {
    if (!card) alert('No card')
    if (!condition) alert('No condition')
    if (!price) alert('No price')
    const listing = {
      card,
      condition,
      price,
    }
    addCard(listing)
    clear()
    e.preventDefault()
  }

  const clear = () => {
    setMatches([])
    setCard({})
    setFilteredSets([])
    setCondition('')
    setPrice(0)
  }

  React.useEffect(() => {
    if ((filteredSets && !matches) || matches.length === 0) return
    let acc = []
    if (!matches || matches.length < 1) {
      acc = Array.from(sets.values())
    } else {
      for (let i = 0; i < matches.length; i++) {
        const match = matches[i]
        const set = sets.get(match.set)
        console.log('filtering', set)
        set && acc.push(set)
      }
    }
    setFilteredSets(acc.sort((a, b) => (a.name > b.name ? 1 : -1)))
  }, [matches, sets])
  return (
    <form className={box} onSubmit={(e) => handleSubmit(e)}>
      <div className={entry}>
        <label>Card Name</label>
        <CardChooser
          className={entry}
          setMatches={setMatches}
          setCard={setCard}
        />
      </div>
      <div className={entry}>
        <label>Set</label>

        <Select
          className={setSelectClass}
          onChange={(val) => setCardVersion(val)}
          getOptionValue={(v) => {
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
          options={filteredSets}
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
