import firebase from 'firebase/app'
import 'firebase/auth'

export const useAuth = () => {
  return useAuthProvider()
}
const useAuthProvider = () => {
  const logout = () => {
    return firebase
      .auth()
      .signOut()
      .catch((err) => {
        console.error('failed to log out', err)
      })
  }
  const onAuthStateChanged = (cb) => {
    firebase
      .auth()
      .onAuthStateChanged((u) => cb(u))
      .catch((e) => console.error('error on auth state change', e))
  }
  const user = firebase.auth().user
  return { user, logout, onAuthStateChanged }
}
