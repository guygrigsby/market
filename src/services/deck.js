import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator'
export const Upstream = 'https://us-central1-snackend.cloudfunctions.net'

export const createTTS = (deck) => {
  const fullURI = new URL(`${Upstream}/CreateTTSDeckFromInternal`)
  const headers = new Headers()
  headers.append('Accept-Encoding', 'gzip')
  return fetch(fullURI, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(deck),
  })
    .then(async (response) => await response.json())
    .then((res) => {
      return res
    })
    .catch((e) => console.error(e))
}

export const fetchDecks = (url) => {
  const fullURI = new URL(`${Upstream}/CreateAllFormats?deck=${url}`)
  const headers = new Headers()
  headers.append('Accept-Encoding', 'gzip')
  return fetch(fullURI, {
    headers: headers,
  })
    .then((response) => response.json())

    .catch((e) => console.error(e))
}

export const getDeckName = (url) => {
  const domain = getDomain(url)
  let sel
  let cleanup
  switch (domain) {
    case 'deckbox.org':
      sel = `title`
      cleanup = (str) => str.split(' ')[1]
      break
    case 'tappedout.net':
      sel = `#body > div:nth-child(6) > div > div.col-lg-9.col-md-8 > div:nth-child(1) > div > div > h2`
      break
    default:
      return
  }

  return fetch(url)
    .then((res) => {
      return res.text()
    })
    .then((res) => {
      const parser = new DOMParser()
      const htmlDoc = parser.parseFromString(res, 'text/html')
      const title = htmlDoc.querySelector(sel).innerText

      return cleanup(title)
    })
    .catch((e) => {
      console.error('Generating title: failed to get deck name.', e)
      return uniqueNamesGenerator({
        dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
      })
    })
}

const getDomain = (url) => {
  const hostName = getHostName(url)
  let domain = hostName

  if (hostName != null) {
    var parts = hostName.split('.').reverse()

    if (parts != null && parts.length > 1) {
      domain = parts[1] + '.' + parts[0]

      if (hostName.toLowerCase().indexOf('.co.uk') !== -1 && parts.length > 2) {
        domain = parts[2] + '.' + domain
      }
    }
  }

  return domain
}
const getHostName = (url) => {
  const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i)
  if (
    match != null &&
    match.length > 2 &&
    typeof match[2] === 'string' &&
    match[2].length > 0
  ) {
    return match[2]
  } else {
    return null
  }
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
