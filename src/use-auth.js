import React, { useState, useEffect, useContext, createContext } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'

// Add your Firebase credentials
firebase.initializeApp({
  apiKey: 'AIzaSyCRmb76McESvNi440lZx24PazPsql9H-zk',
  authDomain: 'marketplace-c87d0.firebaseapp.com',
  databaseURL: 'https://marketplace-c87d0.firebaseio.com',
  projectId: 'marketplace-c87d0',
  storageBucket: 'marketplace-c87d0.appspot.com',
  messagingSenderId: '847837735961',
  appId: '1:847837735961:web:2e3f177db742e483334e88',
  measurementId: 'G-3XFHFT0SZZ',
})

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
  const [user, setUser] = useState(null)
  // Wrap any Firebase methods we want to use making sure ...
  // ... to save the user to state.
  const login = (email, password) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        setUser(response.user)
        return response.user
      })
  }

  const signup = (email, password) => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        setUser(response.user)
        return response.user
      })
  }

  const logout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(false)
      })
  }

  const sendPasswordResetEmail = (email) => {
    return firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        return true
      })
  }

  const confirmPasswordReset = (code, password) => {
    return firebase
      .auth()
      .confirmPasswordReset(code, password)
      .then(() => {
        return true
      })
  }
  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('user is logged in', user)
        setUser(user)
      } else {
        console.log('user is logged out')
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
  }
}
