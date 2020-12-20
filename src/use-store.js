import firebase from 'firebase/app'
import 'firebase/firestore'

const USERS_DB = 'users'
const INVENTORY_DB = 'cards'
const CONDITIONS_TABLE = '/conditions'
const USER_DECKS_DB = 'decks'

export const useStore = () => {
  return useFirebaseStore()
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
  // used to copy user data from anon user to permanent user
  const mergeUsers = (temp, user) => {
    return db
      .collection(USERS_DB)
      .doc(temp.uid)
      .get()
      .then((tmpDoc) => {
        const ret = db
          .collection(USERS_DB)
          .doc(user.uid)
          .update(tmpDoc)
          .then(() => console.log('users merged', temp.uid, user.uid))
          .catch((e) => {
            console.error('failed to merge users', temp.uid, user.uid)
          })
        return ret
      })
      .catch((e) => console.error('failed to get anon user docs'))
  }

  const writeUser = (user) => {
    firebase.analytics().logEvent('user_created')
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
    mergeUsers,
    getConditions,
    writeUser,
    writeUserData,
    removeCardsFromCollection,
    writeCardsToCollection,
    writeDeck,
    allListings,
  }
}
