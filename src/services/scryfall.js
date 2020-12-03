import Collection from '../components/Collection'

const SEARCH_URL = 'https://api.scryfall.com/cards/search'
const NAMED_URL = 'https://api.scryfall.com/cards/named'
const SETS_URL = 'https://api.scryfall.com/sets'

const CONST_HEADERS = new Headers()
CONST_HEADERS.append('Accept-Encoding', 'gzip')
CONST_HEADERS.append('Origin', 'https://mtg.fail')
const inc = 75
export const getDeck = (names) => {
  // 75 max
  const uri = `https://api.scryfall.com/cards/collection`
  const segs = names.length / 75 + 1
  const deck = []
  var i = 1
  var start = 0
  var end = inc
  for (; i <= segs; i++) {
    deck.push(collection(uri, names.slice(start, end)))
    i++
    start += inc
    end += inc
  }
}
// max 75
const collection = async (uri, cards) => {
  return await fetch(uri, {
    method: 'POST',
    headers: CONST_HEADERS,
    body: JSON.stringify(new Collection(cards)),
  }).then(async (res) => await res.json)
}
export const getExactCard = (name, set) => {
  const uri = `${NAMED_URL}?exact=${name}&set=${set.code}`
  return fetch(uri, {
    headers: CONST_HEADERS,
  })
    .then((res) => res.json())
    .then((j) => j.data)
}
export const searchForCard = (name) => {
  const uri = `${SEARCH_URL}?q=${name}&unique=prints&order=sets`
  return fetch(uri, {
    headers: CONST_HEADERS,
  })
    .then((res) => res.json())
    .then((j) => j.data)
}

export const sets = () => {
  return fetch(SETS_URL, { headers: CONST_HEADERS })
    .then(async (r) => await r.json())
    .then((j) => j.data)
}
