class Collection {
  constructor(cards) {
    this.identifiers = adapt(cards)
  }
}

class CardID {
  constructor(name) {
    this.name = name
  }
}

const adapt = (cards) => {
  cards.map((e) => new CardID(e))
}

export default Collection
