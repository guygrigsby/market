import firebase from 'firebase'

const toggleSignIn = (email, password) => {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut()
  } else {
    if (email.length < 4) {
      alert('Please enter an email address.')
      return
    }
    if (password.length < 4) {
      alert('Please enter a password.')
      return
    }
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(function (error) {
        var errorCode = error.code
        var errorMessage = error.message
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.')
        } else {
          alert(errorMessage)
        }
        console.log(error)
      })
  }
}
const signup = (email, password) => {
  if (email.length < 4) {
    alert('Please enter an email address.')
    return
  }
  if (password.length < 4) {
    alert('Please enter a password.')
    return
  }
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch((error) => {
      var errorCode = error.code
      var errorMessage = error.message
      if (errorCode === 'auth/weak-password') {
        alert('The password is too weak.')
      } else {
        alert(errorMessage)
      }
      console.log(error)
    })
}

/**
 * Sends an email verification to the user.
 */
const sendEmailVerification = () => {
  firebase
    .auth()
    .currentUser.sendEmailVerification()
    .then(() => {
      alert('Email Verification Sent!')
    })
}

const sendPasswordReset = (email) => {
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(() => {
      alert('Password Reset Email Sent!')
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      if (errorCode === 'auth/invalid-email') {
        alert(errorMessage)
      } else if (errorCode === 'auth/user-not-found') {
        alert(errorMessage)
      }
      console.log(error)
    })
}

export { toggleSignIn, signup, sendEmailVerification, sendPasswordReset }
