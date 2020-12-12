import './firebase.js'
import firebase from 'firebase/app'

const FirebaseProvider = ({ children }) => {
  firebase.analytics()
  return { children }
}

export default FirebaseProvider
