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
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
  return useContext(authContext)
}
// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const fbAuth = firebase.auth()
  const [user, setUser] = useState(null)

  // Wrap any Firebase methods we want to use making sure ...
  // ... to save the user to state.
  const login = (email, password) => {
    return fbAuth
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        setUser(response.user)
        return response.user
      })
  }

  const signup = (email, password) => {
    return fbAuth
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        setUser(response.user)
        return response.user
      })
  }

  const logout = () => {
    return fbAuth.signOut().then(() => {
      setUser(false)
    })
  }

  const sendPasswordResetEmail = (email) => {
    return fbAuth.sendPasswordResetEmail(email).then(() => {
      return true
    })
  }

  const confirmPasswordReset = (code, password) => {
    return fbAuth.confirmPasswordReset(code, password).then(() => {
      return true
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
    signup,
    logout,
    sendPasswordResetEmail,
    confirmPasswordReset,
    onAuthStateChanged,
  }
}
