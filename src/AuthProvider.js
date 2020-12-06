import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase/app'
import 'firebase/auth'

const context = React.createContext()

export const useAuth = () => {
  return useContext(context)
}

const AuthProvider = ({ auth, children }) => {
  const a = useAuthProvider(auth)
  return <context.Provider value={a}>{children}</context.Provider>
}

const useAuthProvider = (auth) => {
  const [user, setUser] = useState(false)

  const logout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(false)
      })
      .catch((err) => {
        console.error('failed to log out', err)
      })
  }
  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(
      (u) => {
        if (u) {
          setUser(u)
        } else {
          setUser(false)
        }
      },
      function (error) {
        console.error('error on auth state change', error)
      },
    )
  }, [auth])
  return { user, logout }
}

AuthProvider.propTypes = {
  children: PropTypes.object,
}
export default AuthProvider
