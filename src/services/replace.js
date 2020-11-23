export const updateTTS = (deck, newCard, oldCard) => {
  for (let i = 0; i < deck.ObjectStates.length; i++) {
    const os = deck.ObjectStates[i]
    for (let k = 0; os.ContainedObjects.length; k++) {
      const current = os.ContainedObjects[k]
      if (oldCard.name === current.Nickname) {
        os.CustomDeck[k + 1].FaceURL = newCard.image_uris.normal
        break
      }
    }
  }

  return deck
  /*
   *d
{…}
ObjectStates: (1) […]
0: {…}
ContainedObjects: (2) […]
0: Object { CardID: 100, Name: "Card", Nickname: "Phyrexian Arena", … }
1: Object { CardID: 200, Name: "Card", Nickname: "Opt", … }
length: 2
<prototype>: Array []
CustomDeck: {…}
1: Object { FaceURL: "https://c1.scryfall.com/file/scryfall-cards/large/front/f/7/f7733d0e-ede5-4efc-a622-514a56d77fde.jpg", BackURL: "https://www.frogtown.me/images/gatherer/CardBack.jpg", NumHeight: 1, … }
2: Object { FaceURL: "https://c1.scryfall.com/file/scryfall-cards/large/front/c/3/c3669391-8f64-4904-b432-0f0582f30449.jpg", BackURL: "https://www.frogtown.me/images/gatherer/CardBack.jpg", NumHeight: 1, … }
<prototype>: Object { … }
DeckIDs: Array [ 100, 200 ]
   * */
}

export const binary = (deck, newC, oldName) => {
  const nd = [...deck]
  for (let i = deck.length / 2; ; ) {
    if (deck[i].name === oldName) {
      nd.splice(i, 1)
      break
    }
    if (deck[i].name > oldName) {
      i = (deck.length - i) / 2 + i
    } else {
      i = i - (deck.length - i) / 2
    }
  }
  let prev = deck.length / 2
  for (let i = prev; ; ) {
    if (i === prev || Math.abs(i - prev) === 1) {
      nd.splice(i, 0, newC)
      break
    }
    if (deck[i].name > oldName) {
      i = (deck.length - i) / 2 + i
    } else {
      i = i - (deck.length - i) / 2
    }
    prev = i
  }
}

export const naive = (deck, newC, oldC) => {
  const nd = [...deck]
  for (let i = 0; i < deck.length; i++) {
    const card = nd[i]
    if (oldC.name === card.name) {
      nd.splice(i, 1, newC)
      break
    }
  }

  return nd
}
