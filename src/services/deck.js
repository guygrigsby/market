export const Upstream = 'https://us-central1-snackend.cloudfunctions.net'

export const convertToTTS = async (deck) => {
  const fullURI = new URL(`${Upstream}/CreateTTSDeck`)

  const body = JSON.stringify({ Cards: deck })

  let requestOptions = {
    method: 'POST',
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'omit', // include, *same-origin, omit
    redirect: 'follow', // manual, *follow, error
    body: body,
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  }

  const ret = await callAPI(fullURI, requestOptions)
  return ret
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
    .then(async (response) => {
      if (!response.ok) {
        const error = `Unexpected response: ${response.status}: ${response.statusText}`
        console.error('error', error, 'status', response.status)
        return Promise.reject(error)
      }
      const contentType = response.headers.get('Content-Type')
      if (!contentType || !contentType.includes('application/json')) {
        return Promise.reject(TypeError('expected JSON response'))
      }
      return await response.json()
    })
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
