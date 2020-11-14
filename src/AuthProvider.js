import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase/app'
import 'firebase/auth'

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
  console.warn('using firebase emulators. Is that intentional?')
  firebase.initializeApp({})
  firebase.auth().useEmulator('http://localhost:9099/')
} else {
  const dotenv = require('dotenv')
  const dotenvExpand = require('dotenv-expand')

  const result = dotenv.config()
  dotenvExpand(result)

  if (result.error) {
    throw result.error
  }

  firebase.initializeApp(process.env.FIREBASE_CONFIG)
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

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((u) => {
      if (u) {
        console.log('user', u)
        setUser(u)
        setAuthenticated(true)
      } else {
        console.log('out')
      }
    })
  }, [])

  const defaultContext = {
    authenticated,
    user,
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
