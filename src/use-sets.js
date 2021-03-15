import setList from './sets.json'
import firebase from 'firebase/app'
import 'firebase/firestore'

const readSets = () => {
  return new Map(
    setList.data
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .map((set) => [set.code, set]),
  )
}
const fetchSets = () => {
  return firebase
    .firestore()
    .collection('Sets')
    .get()
    .then((querySnapshot) => {
      let m = new Map()
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const set = doc.data()
        console.log(doc.id, ' => ', set)
        m.set(set.Code, set)
      })
      return m
    })
    .then((m) => {
      console.log('from db', m)
      return m
    })
}

const colorRegex = /fill="#\d*"/i

const getSVGs = (sets) => {
  sets.forEach((v, k, map) => {
    fetch(v.icon_svg_uri).then(async (res) => {
      const svg = await res.text()
      // strip the fill so we can change it as required later
      v.logo = svg.replace(colorRegex, '')
      map[k] = v
    })
  })
}

const sets = readSets()
const setss = fetchSets()
getSVGs(sets)
console.log('set compare current', sets, 'from db', setss)

export const useSets = () => {
  return sets
}
