import Collection from '../components/Collection'

const BULK_URL =
  'https://c2.scryfall.com/file/scryfall-bulk/default-cards/default-cards-20201114100433.json'
const SEARCH_URL = 'https://api.scryfall.com/cards/search'
const SETS_URL = 'https://api.scryfall.com/sets'

const CONST_HEADERS = new Headers()
CONST_HEADERS.append('Accept-Encoding', 'gzip')
CONST_HEADERS.append('Origin', 'https://mtg.fail')

export const getDeckLocal = (uri) => {
  const text = `${uri}/export`
  fetch(text, {
    headers: {
      origin: 'localhost:3000',
    },
  })
    .then((res) => {
      getDeck(uri)
      return res
    })
    .then((str) => {
      const body = document.querySelectorAll('body')
      body.forEach((a) => {
        return str
      })
    })
}

const inc = 75
const uri = `https://api.scryfall.com/cards/collection`
export const getDeck = (names) => {
  // 75 max
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

export const searchForCard = async (name) => {
  const uri = `${SEARCH_URL}?q=${name}&unique=prints`
  return fetch(uri, {
    headers: CONST_HEADERS,
  }).then(async (res) => await res.json())
}

export const loadCards = async (onErr) => {
  let url = BULK_URL
  if (process.env.NODE_ENV === 'development') {
    url = require('../services/scryfall.js')
  }
  return fetch(url, { header: CONST_HEADERS })
    .then(async (res) => {
      return await res.json()
    })
    .catch((e) => (onErr ? onErr(e) : null))
}
export const sets = () => {
  return fetch(SETS_URL, { headers: CONST_HEADERS })
    .then(async (r) => await r.json())
    .then((j) => j.data)
}
export const search = (text, onErr) => {
  var url = new URL(SEARCH_URL)

  var params = { q: text }

  url.search = new URLSearchParams(params).toString()

  return fetch(url, { headers: CONST_HEADERS }).then(
    async (res) => await res.json,
  )
}
/*
 *{
  object: 'card',
  id: 'e9d5aee0-5963-41db-a22b-cfea40a967a3',
  oracle_id: '7bc3f92f-68a2-4934-afc4-89f6d0e8cf98',
  multiverse_ids: [
    470609
  ],
  mtgo_id: 77240,
  tcgplayer_id: 196620,
  cardmarket_id: 392062,
  name: 'Dusk // Dawn',
  lang: 'en',
  released_at: '2019-08-23',
  uri: 'https://api.scryfall.com/cards/e9d5aee0-5963-41db-a22b-cfea40a967a3',
  scryfall_uri: 'https://scryfall.com/card/c19/63/dusk-dawn?utm_source=api',
  layout: 'split',
  highres_image: true,
  image_uris: {
    small: 'https://c1.scryfall.com/file/scryfall-cards/small/front/e/9/e9d5aee0-5963-41db-a22b-cfea40a967a3.jpg?1568003829',
    normal: 'https://c1.scryfall.com/file/scryfall-cards/normal/front/e/9/e9d5aee0-5963-41db-a22b-cfea40a967a3.jpg?1568003829',
    large: 'https://c1.scryfall.com/file/scryfall-cards/large/front/e/9/e9d5aee0-5963-41db-a22b-cfea40a967a3.jpg?1568003829',
    png: 'https://c1.scryfall.com/file/scryfall-cards/png/front/e/9/e9d5aee0-5963-41db-a22b-cfea40a967a3.png?1568003829',
    art_crop: 'https://c1.scryfall.com/file/scryfall-cards/art_crop/front/e/9/e9d5aee0-5963-41db-a22b-cfea40a967a3.jpg?1568003829',
    border_crop: 'https://c1.scryfall.com/file/scryfall-cards/border_crop/front/e/9/e9d5aee0-5963-41db-a22b-cfea40a967a3.jpg?1568003829'
  },
  mana_cost: '{2}{W}{W} // {3}{W}{W}',
  cmc: 9,
  type_line: 'Sorcery // Sorcery',
  colors: [
    'W'
  ],
  color_identity: [
    'W'
  ],
  keywords: [
    'Aftermath'
  ],
  card_faces: [
    {
      object: 'card_face',
      name: 'Dusk',
      mana_cost: '{2}{W}{W}',
      type_line: 'Sorcery',
      oracle_text: 'Destroy all creatures with power 3 or greater.',
      artist: 'Noah Bradley',
      artist_id: '81995d11-da98-4f8b-89bd-b88ca2ddb06b',
      illustration_id: 'f3d63aed-2784-4ef5-9676-846b1e65e040'
    },
    {
      object: 'card_face',
      name: 'Dawn',
      mana_cost: '{3}{W}{W}',
      type_line: 'Sorcery',
      oracle_text: 'Aftermath (Cast this spell only from your graveyard. Then exile it.)\nReturn all creature cards with power 2 or less from your graveyard to your hand.',
      artist: 'Noah Bradley',
      artist_id: '81995d11-da98-4f8b-89bd-b88ca2ddb06b'
    }
  ],
  legalities: {
    standard: 'not_legal',
    future: 'not_legal',
    historic: 'legal',
    pioneer: 'legal',
    modern: 'legal',
    legacy: 'legal',
    pauper: 'not_legal',
    vintage: 'legal',
    penny: 'legal',
    commander: 'legal',
    brawl: 'not_legal',
    duel: 'legal',
    oldschool: 'not_legal'
  },
  games: [
    'paper',
    'mtgo'
  ],
  reserved: false,
  foil: false,
  nonfoil: true,
  oversized: false,
  promo: false,
  reprint: true,
  variation: false,
  set: 'c19',
  set_name: 'Commander 2019',
  set_type: 'commander',
  set_uri: 'https://api.scryfall.com/sets/0fa3ccbb-d86d-4a2e-a55e-c4979c4feeb2',
  set_search_uri: 'https://api.scryfall.com/cards/search?order=set&q=e%3Ac19&unique=prints',
  scryfall_set_uri: 'https://scryfall.com/sets/c19?utm_source=api',
  rulings_uri: 'https://api.scryfall.com/cards/e9d5aee0-5963-41db-a22b-cfea40a967a3/rulings',
  prints_search_uri: 'https://api.scryfall.com/cards/search?order=released&q=oracleid%3A7bc3f92f-68a2-4934-afc4-89f6d0e8cf98&unique=prints',
  collector_number: '63',
  digital: false,
  rarity: 'rare',
  card_back_id: '0aeebaf5-8c7d-4636-9e82-8c27447861f7',
  artist: 'Noah Bradley',
  artist_ids: [
    '81995d11-da98-4f8b-89bd-b88ca2ddb06b'
  ],
  illustration_id: 'f3d63aed-2784-4ef5-9676-846b1e65e040',
  border_color: 'black',
  frame: '2015',
  full_art: false,
  textless: false,
  booster: false,
  story_spotlight: false,
  edhrec_rank: 12364,
  prices: {
    usd: '0.59',
    usd_foil: null,
    eur: '0.25',
    eur_foil: null,
    tix: null
  },
  related_uris: {
    gatherer: 'https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=470609',
    tcgplayer_decks: 'https://decks.tcgplayer.com/magic/deck/search?contains=Dusk+%2F%2F+Dawn&page=1&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall',
    edhrec: 'https://edhrec.com/route/?cc=Dusk+%2F%2F+Dawn',
    mtgtop8: 'https://mtgtop8.com/search?MD_check=1&SB_check=1&cards=Dusk+%2F%2F+Dawn'
  },
  purchase_uris: {
    tcgplayer: 'https://shop.tcgplayer.com/product/productsearch?id=196620&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall',
    cardmarket: 'https://www.cardmarket.com/en/Magic/Products/Singles/Commander-2019/Dusk-Dawn?quereferrer=scryfall&utm_campaign=card_prices&utm_medium=text&utm_source=scryfall',
    cardhoarder: 'https://www.cardhoarder.com/cards/77240?affiliate_id=scryfall&ref=card-profile&utm_campaign=affiliate&utm_medium=card&utm_source=scryfall'
  }
}
 * */
