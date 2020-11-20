import React from 'react'
import CardForm from '../components/CardForm'
import CardList from '../components/CardList'
const Selling = ({ sets, setSets, cards, addCard, removeCard }) => {
  const columns = [
    {
      accessor: 'id',
      Header: 'ID',
    },
    {
      accessor: 'name',
      Header: 'Name',
    },
    {
      accessor: 'set',
      Header: 'Set',
    },
    {
      accessor: 'condition',
      Header: 'Condition',
    },
    {
      accessor: 'price',
      Header: 'My Price',
    },
  ]
  return (
    <>
      <CardForm
        sets={sets}
        setSets={setSets}
        addCard={addCard}
        removeCard={removeCard}
      />
      <CardList cards={cards} columns={columns} />
    </>
  )
}
export default Selling
