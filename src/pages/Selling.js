import React from 'react'
import CardForm from '../components/CardForm'
import CardList from '../components/CardList'
import 'firebase/firestore'
const Selling = ({ listings, setListings, sets, setSets }) => {
  const addCard = (listing) => {
    setListings((prev) => {
      const n = prev ? [...prev] : []
      n.push(listing)
      return n
    })
  }

  const removeCard = (card) => {
    setListings((prev) => {
      if (!prev) return
      var index = prev.indexOf(card)
      const m = prev
      if (index !== -1) {
        const m = [...prev]
        m.splice(index, 1)
      }
      return m
    })
  }

  //  const resetCardList = (user) => setListings(store && store.allListings(user))
  //
  //  console.log('auth', auth, 'store', store)
  //  firebase
  //    .auth()
  //    .onAuthStateChanged((u) =>
  //      auth.user && auth.user.uid === u.uid ? {} : resetCardList(u),
  //    )
  //
  // React.useEffect(() => {
  //   if (!store || !auth.user) return
  //   const f = async () => {
  //     console.log('writing listings', listings)
  //     await store.writeCardsToCollection(auth.user.uid, listings)
  //     setListings([...listings])
  //   }

  //   f()
  // }, [listings, auth.user, setListings, store])
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
        submitText="Add"
        sets={sets}
        setSets={setSets}
        addCard={addCard}
        removeCard={removeCard}
      />
      <CardList columns={columns} cards={listings} />
    </>
  )
}
export default Selling
