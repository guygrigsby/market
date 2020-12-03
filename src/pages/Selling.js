import React from 'react'
import CardForm from '../components/CardForm'
import CardList from '../components/CardList'
const Selling = ({ sets, setSets, addCard, removeCard }) => {
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
      <CardForm sets={sets} addCard={addCard} removeCard={removeCard} />
      <CardList columns={columns} />
    </>
  )
}
export default Selling
