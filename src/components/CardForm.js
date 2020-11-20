import React from 'react'
import setList from '../sets.json'
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

const CardForm = ({ sets, setSets, addCard, removeCard }) => {
  const [matches, setMatches] = React.useState(false)
  const [card, setCard] = React.useState('')
  const [filteredSets, setFilteredSets] = React.useState(
    Array.from(sets.values()),
  )
  const [set, setSet] = React.useState('')
  const [condition, setCondition] = React.useState('')
  const [price, setPrice] = React.useState('')

  const handleSubmit = (e, card, condition, price) => {
    addCard(card)
    console.log('card added', card)
    e.preventDefault()
  }
  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      const form = e.target.form
      const index = Array.prototype.indexOf.call(form, e.target)
      form.elements[index + 1].focus()
      e.preventDefault()
    }
  }

  const loadSets = () => {
    return new Map(
      setList.data
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map((set) => [set.name, set]),
    )
  }

  React.useEffect(() => {
    let m = []
    if (!matches || matches.length < 1) {
      m = Array.from(sets.values())
    } else {
      let c

      for (c in matches) {
        m.push(sets.get(c.set))
      }
    }
    setFilteredSets(m)
    console.log('fsts', m)
  }, [matches, sets])

  React.useEffect(() => {
    const f = () => {
      const s = loadSets()
      setSets(s)
    }
    f()
  }, [setSets])

  return (
    <form
      className={box}
      onSubmit={(e) => handleSubmit(e, card, condition, price)}
    >
      <div className={entry}>
        <label>Card Name</label>
        <CardChooser
          className={entry}
          set={set}
          matches={matches}
          setMatches={setMatches}
          handleKeyPress={handleKeyPress}
          setCard={setCard}
        />
      </div>
      <div className={entry}>
        <label>Set</label>

        <Select
          className={setSelectClass}
          onChange={(val) => setSet(val)}
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
