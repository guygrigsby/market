export const Upstream = 'https://us-central1-snackend.cloudfunctions.net'

export const fetchDecks = (url) => {
  const fullURI = new URL(`${Upstream}/CreateAllFormats?deck=${url}`)
  const headers = new Headers()
  headers.append('Accept-Encoding', 'gzip')
  return fetch(fullURI, {
    headers: headers,
  })
    .then(async (response) => await response.json())
    .then((res) => {
      console.log('decks', res)
      return res
    })
    .catch((e) => console.log(e))
}

export const fetchDeck = async (url) => {
  const requestOptions = {
    method: 'GET',
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'omit', // include, *same-origin, omit
    redirect: 'follow', // manual, *follow, error
  }

  const fullURI = new URL(`${Upstream}/CreateInternalDeck?deck=${url}`)
  const ret = await callAPI(fullURI, requestOptions)
  return ret
}

const callAPI = (url, requestOptions) => {
  return fetch(url, requestOptions)
    .then(async (response) => await response.json())
    .then(async (data) => {
      console.log('setting data', data)
      return data
    })
}

const ParseDeck = (deck) => {
  if (deck === undefined) {
    return
  }
  const obs = deck.ContainedObjects
  const imgs = deck.CustomDeck
  let cards = []
  for (let i = 0; i < obs.length; i++) {
    const name = obs[i].Nickname
    const img = imgs[i + 1]
    var card = {}
    card.Name = name
    card.Image = img.FaceURL
    cards.push(card)
  }
  return cards
}

export default ParseDeck
