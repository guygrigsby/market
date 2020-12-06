import './firebase.js'
import AuthProvider from './AuthProvider.js'
import ProvideStore from './use-store.js'
import firebase from 'firebase/app'

const FirebaseProvider = ({ children }) => {
  firebase.analytics()
  const auth = firebase.auth()
  return (
    <ProvideStore>
      <AuthProvider auth={auth}>{children}</AuthProvider>
    </ProvideStore>
  )
}

export default FirebaseProvider
