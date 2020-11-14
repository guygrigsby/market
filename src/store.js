import firebase from 'firebase/app'
import 'firebase/database'

var db = firebase.database()
db.useEmulator('localhost', 9001)

const writeUserData = (userId, name, email, imageUrl) => {
  firebase
    .database()
    .ref('users/' + userId)
    .set({
      username: name,
      email: email,
      profile_picture: imageUrl,
    })
}
export default writeUserData
