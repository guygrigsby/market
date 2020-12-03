import React, { useContext, createContext } from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'

const USERS_DB = 'users'
const INVENTORY_DB = 'cards'
const CONDITIONS_TABLE = '/conditions'
const USER_DECKS_DB = 'decks'

firebase.initializeApp({
  apiKey: 'AIzaSyCRmb76McESvNi440lZx24PazPsql9H-zk',
  authDomain: 'marketplace-c87d0.firebaseapp.com',
  databaseURL: 'https://marketplace-c87d0.firebaseio.com',
  projectId: 'marketplace-c87d0',
  storageBucket: 'marketplace-c87d0.appspot.com',
  messagingSenderId: '847837735961',
  appId: '1:847837735961:web:2e3f177db742e483334e88',
  measurementId: 'G-3XFHFT0SZZ',
})

if (process.env.NODE_ENV === 'development') {
  console.log('dev', process.env.NODE_ENV)
  firebase.auth().useEmulator('http://localhost:9099/')
  firebase.firestore().useEmulator('localhost', 8080)
} else {
  console.log('not dev', process.env.NODE_ENV)
}

const storeContext = createContext()
export function ProvideStore({ children }) {
  const store = useFirebaseStore()
  return <storeContext.Provider value={store}>{children}</storeContext.Provider>
}

export const useStore = () => {
  return useContext(storeContext)
}

const useFirebaseStore = () => {
  const db = firebase.firestore()
  const getConditions = (userId) => {
    return db
      .ref(CONDITIONS_TABLE)
      .once('codes')
      .then((snapshot) => {
        const codes = snapshot.val()
        return codes
      })
  }

  const writeUser = (user) => {
    db.collection(USERS_DB)
      .doc(user.uid)
      .set({
        name: user.displayName,
        email: user.uid,
      })
      .catch(function (error) {
        console.error('Error writing document: ', error)
      })
  }
  const writeUserData = (user, field, value) => {
    return db
      .collection(USERS_DB)
      .doc(user.uid)
      .update({
        [field]: value,
      })
      .catch(function (error) {
        console.error('Error updating document: ', error)
      })
  }
  const removeCardsFromCollection = (userId, listings) => {
    listings.forEach((listing) =>
      db
        .collection(USERS_DB)
        .doc(userId)
        .collection(INVENTORY_DB)
        .delete(listing.card.id)
        .catch(function (error) {
          console.error('Error writing document: ', error)
        }),
    )
  }

  const writeCardsToCollection = (userId, listings) => {
    listings.forEach((listing) =>
      db
        .collection(USERS_DB)
        .doc(userId)
        .collection(INVENTORY_DB)
        .doc(listing.card.id)
        .set(listing)
        .catch(function (error) {
          console.error('Error writing document: ', error)
        }),
    )
  }

  const allListings = (user) => {
    return db
      .collection(USERS_DB)
      .doc(user.uid)
      .collection(INVENTORY_DB)
      .orderBy('name')
      .limit(100)
  }
  const writeDeck = (user, deck, ttsDeck, name) => {
    return db
      .collection(USERS_DB)
      .doc(user.uid)
      .collection(USER_DECKS_DB)
      .doc(name)
      .set({
        deck,
        ttsDeck,
      })
      .catch((err) => console.error('error writing deck', err))
  }
  return {
    getConditions,
    writeUser,
    writeUserData,
    removeCardsFromCollection,
    writeCardsToCollection,
    writeDeck,
    allListings,
  }
}
