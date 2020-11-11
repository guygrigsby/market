import React, { useState } from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase'

export const RootContext = React.createContext()
const Root = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(null)
  const [user, setUser] = useState(false)

  React.useEffect(() => {
    fetch('/__/firebase/init.json').then(async (response) => {
      firebase.initializeApp(await response.json())
      firebase.auth().useEmulator('http://localhost:9099/')
      firebase.auth().onAuthStateChanged((u) => {
        if (u) {
          console.log('user', u)
          setUser(u)
          setAuthenticated(true)
        } else {
          console.log('out')
        }
      })
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

Root.propTypes = {
  children: PropTypes.object,
}
export default Root
