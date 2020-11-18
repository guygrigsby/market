import React from 'react'
import { css } from 'pretty-lights'
import PropTypes from 'prop-types'
import Card from '../card'
import AsyncAutoComplete from './AutoComplete'
import { useAuth } from '../use-auth'
import { getConditions } from '../store'

const entry = css`
  flex: 0 1 200px;
  padding: 10px;
`
const box = css`
  display: flex;
  padding: 12px;
  background-color: #f5f5f5;
  flex-flow: row wrap;
  width: 50%;
  border: 1px solid grey;
`
const CardForm = ({ addCard, removeCard }) => {
  const [name, setCardName] = React.useState('')
  const [set, setSet] = React.useState('')
  const [condition, setCondition] = React.useState('')
  const [price, setPrice] = React.useState('')

  const [conditionList, setConditionList] = React.useState([])
  const auth = useAuth()

  const handleSubmit = (e, name, set, condition, price) => {
    e.preventDefault()
    const card = new Card(name, set, condition, price)
    addCard(card)
    console.log('card added', card)
  }

  React.useEffect(() => {
    const f = async () => {
      try {
        const res = await getConditions(auth)
        setConditionList(res)
      } catch (e) {
        setConditionList(['M', 'NM', 'LP', 'MP', 'HP'])
      }
    }
    f()
  }, [auth])

  return (
    <div className={box}>
      <div className={entry}>
        <label>Card Name</label>
        <AsyncAutoComplete setCardName={setCardName} />
      </div>
      <div className={entry}>
        <label>Set</label>
        <input
          id="set"
          value={set}
          type="select"
          onChange={(e) => setSet(e.target.value)}
        />
      </div>
      <div>
        <div className={entry}>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            {conditionList.map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={entry}>
        <label>My Price</label>
        <input
          id="price"
          value={price}
          type="number"
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <button onClick={(e) => handleSubmit(e, name, set, condition, price)}>
        Add
      </button>
    </div>
  )
}
CardForm.propTypes = {
  addCard: PropTypes.func,
  removeCard: PropTypes.func,
}
export default CardForm
