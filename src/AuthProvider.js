import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase/app'
import 'firebase/auth'
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCRmb76McESvNi440lZx24PazPsql9H-zk',
  authDomain: 'marketplace-c87d0.firebaseapp.com',
  databaseURL: 'https://marketplace-c87d0.firebaseio.com',
  projectId: 'marketplace-c87d0',
  storageBucket: 'marketplace-c87d0.appspot.com',
  messagingSenderId: '847837735961',
  appId: '1:847837735961:web:2e3f177db742e483334e88',
  measurementId: 'G-3XFHFT0SZZ',
}
const RootContext = React.createContext()
// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(RootContext)
}

const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(null)
  const [user, setUser] = useState(false)
  firebase.initializeApp(firebaseConfig)
  console.log('auth prv')
  const conf = firebase.auth()
  React.useEffect(() => {
    const unsubscribe = conf.onAuthStateChanged((u) => {
      if (u) {
        console.log('user is logged in', u)
        setUser(u)
        setAuthenticated(true)
      } else {
        console.log('user is not logged in')
      }
    })
    // Cleanup subscription on unmount

    return () => unsubscribe()
  }, [conf])

  const defaultContext = {
    authenticated,
    user,
    config: conf,
  }
  return (
    <RootContext.Provider value={defaultContext}>
      {children}
    </RootContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.object,
}
export default AuthProvider
