import { decodeResponse } from '../errors/display.js'

export let Upstream
if (process.env.NODE_ENV === 'development') {
  //Upstream = 'https://us-central1-marketplace-c87d0.cloudfunctions.net'
  Upstream = 'http://localhost:8080'
} else {
  Upstream = 'https://us-central1-marketplace-c87d0.cloudfunctions.net'
}
const handleErrors = (response) => {
  if (!response.ok) {
    const res = response.text()
    if (res) {
      console.Error(`${response.statusText}: ${decodeResponse(res)}`)
    }
    console.Errori('Errot with status', response.statusText)
  }
  return response
}
export const decodeTTS = async (file) => {
  const fullURI = new URL(`${Upstream}/DecodeTTSDeck`)
  //let compressedBody = await compress(file)
  const headers = new Headers()
  headers.append('Accept-Encoding', 'gzip')
  return fetch(fullURI, {
    method: 'POST',
    headers: headers,
    body: file,
  })
    .then(async (response) => await response.json())
    .then((res) => {
      return res
    })
    .catch((e) => console.error(e))
}

export const isValid = (decklist) => {
  const lines = decklist.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[0].split(' ')
    const count = parseInt(line[0])
    console.log('parsed line', count)
    if (count === 'NaN') {
      throw Error(`Invalid decklist: ${line} does not start with a number`)
    }
  }
  return decklist
}

export const fetchDecksFromList = (decklist) => {
  const fullURI = new URL(`${Upstream}/CreateAllFormats?decklist=${true}`)
  const headers = {
    'Accept-Encoding': 'gzip',
    'Content-Type': 'text/plain',
  }
  return fetch(fullURI, {
    method: 'POST',
    headers: headers,
    body: decklist,
  })
    .then(handleErrors)
    .then((response) => response.json())
}
export const fetchDecks = (url) => {
  const fullURI = new URL(`${Upstream}/CreateAllFormats?deck=${url}`)
  const headers = new Headers()
  headers.append('Accept-Encoding', 'gzip')
  console.log('fetching', url)
  return fetch(fullURI, {
    headers: headers,
  })
    .then(handleErrors)
    .then(async (response) => {
      const j = await response.json()
      console.log('reponse', j)
      return j
    })
    .then((res) => {
      res.internal = res
        ? res.internal.map((card, i) => {
            const newID = `${card.id}-${i}`
            card.id = newID
            return card
          })
        : []
      return res
    })
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
    .then(handleErrors)
    .then(async (response) => await response.json())
    .then(async (data) => {
      return data
    })
}
