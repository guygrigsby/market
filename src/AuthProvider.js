import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase/app'
import 'firebase/auth'
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
firebase.initializeApp(firebaseConfig)

const RootContext = React.createContext()

export const useAuth = () => {
  return useContext(RootContext)
}

const AuthProvider = ({ children }) => {
  const user = useAuthProvider()
  return <RootContext.Provider value={user}>{children}</RootContext.Provider>
}

const useAuthProvider = () => {
  const [user, setUser] = useState(false)

  const logout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(false)
      })
  }
  const auth = firebase.auth()
  React.useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(
      (u) => {
        if (u) {
          setUser(u)
        } else {
          setUser(false)
        }
      },
      function (error) {
        console.log('error on auth state change', error)
      },
    )

    return () => unsubscribe()
  }, [auth])
  return { user, logout }
}

AuthProvider.propTypes = {
  children: PropTypes.object,
}
export default AuthProvider
