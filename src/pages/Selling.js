import React from 'react'
import CardForm from '../components/CardForm'
import setList from '../sets.json'
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

  const loadSets = () => {
    return new Map(
      setList.data
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map((set) => [set.code, set]),
    )
  }

  React.useEffect(() => {
    const f = () => {
      const s = loadSets()
      setSets(s)
    }
    f()
  }, [setSets])

  return (
    <>
      <CardForm sets={sets} addCard={addCard} removeCard={removeCard} />
      <CardList cards={cards} columns={columns} />
    </>
  )
}
export default Selling
