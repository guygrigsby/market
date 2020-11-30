import React from 'react'
import * as firebaseui from 'firebaseui'
import '../firebaseui.css'
import firebase from 'firebase/app'
// This is our firebaseui configuration object
export const uiConfig = {
  signInSuccessUrl: '/',
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID,
  ],
  tosUrl: '/terms-of-service', // This doesn't exist yet
}

const LoginPage = () => {
  React.useEffect(() => {
    const loginPopup = new firebaseui.auth.AuthUI(firebase.auth())
    loginPopup.start('#firebaseui', uiConfig)
  })

  return <div id="firebaseui" />
}

export default LoginPage
