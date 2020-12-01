import React from 'react'
import firebase from 'firebase'
import 'firebase/functions'

const db = firebase.firestore()
var sql = firebase.database()
if (process.env.NODE_ENV === 'development') {
  db.useEmulator('localhost', 8080)
  sql.useEmulator('localhost', 9000)
}
export const listItem = async (auth, listing) => {
  db.collection('users')
    .doc('cards')
    .collection('for_sale')
    .doc(listing.card.id)
    .set(listing)
    .then(function (res) {
      console.log('wrote listing ', listing, 'res', res)
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
