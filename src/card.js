import { v4 as uuidv4 } from 'uuid'
class Card {
  constructor(name, set, condition, price) {
    this.id = uuidv4()
    this.name = name
    this.set = set
    this.condition = condition
    this.price = price
  }
  toString() {
    return this.set + ':' + this.name + '(' + this.condition + ')'
  }
}

export default Card
