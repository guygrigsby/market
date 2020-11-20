import React from 'react'
import { css } from 'pretty-lights'
import PropTypes from 'prop-types'
import Select from 'react-select'
import CardChooser from './CardChooser'

const setCell = css`
  display: flex;
  align-items: center;
  font-size: 0.8em;
`
const logoClass = css`
  padding-right: 7px;
`

const selectClass = css`
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

const CardForm = ({ sets, addCard, removeCard }) => {
  const [matches, setMatches] = React.useState(false)
  const [card, setCard] = React.useState('')
  const [set, setSet] = React.useState('')
  const [condition, setCondition] = React.useState('')
  const [price, setPrice] = React.useState('')

  const ref = React.createRef()

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

  return (
    <div className={box}>
      <div className={entry}>
        <label>Card Name</label>
        <CardChooser
          className={entry}
          ref={ref}
          sets={sets}
          matches={matches}
          setMatches={setMatches}
          handleKeyPress={handleKeyPress}
          setCard={setCard}
        />
      </div>
      <div className={entry}>
        <label>Set</label>

        <Select
          className={selectClass}
          onChange={(val) => setSet(val)}
          getOptionValue={(v) => {
            return <span>v.code</span>
          }}
          getOptionLabel={(v) => {
            return (
              <span className={setCell}>
                <img
                  className={logoClass}
                  src={v.icon_svg_uri}
                  alt={v.name}
                  width="15px"
                />
                {v.name}
              </span>
            )
          }}
          options={sets}
        />
      </div>
      <div className={entry}>
        <label>Condition</label>
        <Select
          className={selectClass}
          options={conditionList}
          onChange={(val) => setCondition(val)}
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
      <button onClick={(e) => handleSubmit(e, card, condition, price)}>
        Add
      </button>
    </div>
  )
}
CardForm.propTypes = {
  sets: PropTypes.array.isRequired,
  addCard: PropTypes.func,
  removeCard: PropTypes.func,
}
export default CardForm
