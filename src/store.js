import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/database'

const USERS_DB = 'users'
const INVENTORY_DB = 'cards'
const CONDITIONS_TABLE = '/conditions'
const USER_DECKS_DB = 'decks'

const db = firebase.firestore()
var sql = firebase.database()
if (process.env.NODE_ENV === 'development') {
  db.useEmulator('localhost', 8080)
  sql.useEmulator('localhost', 9000)
}

export const getConditions = (userId) => {
  return firebase
    .database()
    .ref(CONDITIONS_TABLE)
    .once('codes')
    .then((snapshot) => {
      const codes = snapshot.val()
      return codes
    })
}

export const writeUser = (user) => {
  // Add a new document in collection "cities"
  db.collection(USERS_DB)
    .doc(user.email)
    .set({ name: user.diplayName ? user.displayName : 'user' })
    .catch(function (error) {
      console.error('Error writing document: ', error)
    })
}
export const writeUserData = (user, field, value) => {
  return db
    .collection(USERS_DB)
    .doc(user.email)
    .update({
      [field]: value,
    })
    .catch(function (error) {
      console.error('Error updating document: ', error)
    })
}
export const removeCardsFromCollection = (user, cards) => {
  // Get the user doc
  const u = db.collection(USERS_DB).doc(user.email)

  var batch = db.batch()
  cards.forEach((card) => {
    // Get a ref to each card doc
    const d = u.collection(INVENTORY_DB).doc(card.id)
    batch.delete(d)
  })

  return batch.commit().catch((err) => {
    console.error(err)
  })
}

export const writeCardsToCollection = (user, cards) => {
  // Get the user
  const u = db.collection(USERS_DB).doc(user.email)
  var batch = db.batch()
  cards.forEach((card) => {
    // Get a ref to each card added
    const d = u.collection(INVENTORY_DB).doc(card.id)
    batch.set(d, { card })
  })

  return batch.commit().catch((err) => {
    console.error(err)
  })
}

export const writeDeck = (user, deck, ttsDeck, name) => {
  return db
    .collection(USERS_DB)
    .doc(user.email)
    .collection(USER_DECKS_DB)
    .doc(name)
    .update({
      deck,
      ttsDeck,
    })
}
