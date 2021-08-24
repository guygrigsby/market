const SEARCH_URL = 'https://api.scryfall.com/cards/search'
const NAMED_URL = 'https://api.scryfall.com/cards/named'
const SETS_URL = 'https://api.scryfall.com/sets'

const CONST_HEADERS = new Headers()
CONST_HEADERS.append('Accept-Encoding', 'gzip')
CONST_HEADERS.append('Origin', 'https://mtg.fail')

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
