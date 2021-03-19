import setList from './sets.json'
import 'firebase/firestore'

const readSets = () => {
  return new Map(
    setList.data
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .map((set) => [set.code, set]),
  )
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
getSVGs(sets)

export const useSets = () => {
  return sets
}
