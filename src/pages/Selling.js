import React from 'react'
import CardForm from '../components/CardForm'
import CustomCardTable from '../components/CustomCardTable.js'
import { css } from 'pretty-lights'
import setList from '../sets.json'

const page = css`
  display: flex;
  flex: 1 1 auto;
  flex-flow: column wrap;
  justify-content: space-between;
  align-items: center;
`
const selectOptions = {
  0: 'M',
  1: 'NM',
  2: 'LP',
  3: 'MP',
  4: 'HP',
}
const Selling = ({ sets, setSets, cards, addCard, removeCard }) => {
  const columns = [
    {
      dataField: 'id',
      text: 'ID',
    },
    {
      dataField: 'name',
      text: 'Name',
    },
    {
      dataField: 'set',
      text: 'Set',
    },
    {
      dataField: 'condition',
      text: 'Condition',
      formatter: (cell) => selectOptions[cell],
    },
    {
      dataField: 'price',
      text: 'My Price',
    },
  ]

  React.useEffect(() => {
    setSets(setList.data.sort((a, b) => (a.name > b.name ? 1 : -1)))
  }, [setSets])

  return (
    <div className={page}>
      <CardForm sets={sets} addCard={addCard} removeCard={removeCard} />

      <CustomCardTable
        addCard={addCard}
        removeCard={removeCard}
        cards={cards}
        columns={columns}
      />
    </div>
  )
}
export default Selling
