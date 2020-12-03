import React, { useState, useEffect, useContext, createContext } from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import './firebaseui.css'

// This adds firebaseui to the page
// It does everything else on its own
const authContext = createContext()
// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth()
  auth.loginAnon()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
  return useContext(authContext)
}
// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(null)

  const provider = new firebase.auth.GoogleAuthProvider()
  provider.addScope('email')
  firebase.auth().useDeviceLanguage()

  // Wrap any Firebase methods we want to use making sure ...
  // ... to save the user to state.
  const login = () => {
    return firebase
      .auth()
      .signInWithRedirect(provider)
      .then((response) => {
        setUser(response.user)
        return response.user
      })
      .catch((error) => {
        console.log('Error logging in', error)
      })
  }

  const signup = (anonUser) => {
    firebase
      .auth()
      .getRedirectResult()
      .then(function (result) {
        console.log('redirect', result)
        if (result.credential) {
          const token = result.credential.accessToken
          const credential = firebase.auth.GoogleAuthProvider.credential(token)
          firebase
            .auth()
            .currentUser.linkWithCredential(credential)
            .then((usercred) => {
              const user = usercred.user
              setUser(user)
              console.log('Anonymous account successfully upgraded', user)
              return user
            })
            .catch((error) => {
              console.log('Error upgrading anonymous account', error)
            })

          console.log('credentials', credential)
          return credential
        }
      })

    firebase.auth().signInWithRedirect(provider)
  }

  const logout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(false)
      })
      .catch((error) => {
        console.log('Error logging out account', error)
      })
  }

  const loginAnon = () => {
    return firebase
      .auth()
      .signInAnonymously()
      .then((response) => {
        setUser(response.user)
        return response.user
      })
      .catch((error) => {
        console.log('Error logging intoanonymous account', error)
      })
  }
  const onAuthStateChanged = (cb) => {
    firebase.auth().onAuthStateChanged((user) => {
      cb(user)
    })
  }
  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      console.log('auth state changed', user)
      if (user) {
        setUser(user)
      } else {
        setUser(false)
      }
    })
    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])
  // Return the user object and auth methods
  return {
    user,
    login,
    loginAnon,
    signup,
    logout,
    onAuthStateChanged,
  }
}
