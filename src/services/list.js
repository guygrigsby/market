import React from 'react'
import firebase from 'firebase'
import 'firebase/functions'

export const listItem = async (auth, listing) => {
  const db = firebase.firestore()
  db.collection('users')
    .doc('cards')
    .collection('for_sale')
    .add(listing)
    .then(function () {
      console.log('Document successfully written!')
    })
    .catch(function (error) {
      console.error('Error writing document: ', error)
    })
}
export const ListingTest = () => {
  const [msg, setMsg] = React.useState('')

  const handleSubmit = () => {}
  return (
    <div>
      <label>Message Info</label>
      <input value={msg} onChange={(e) => setMsg(e.target.value)} />
      <input onSubmit={handleSubmit} />
    </div>
  )
}
