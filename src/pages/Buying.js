import React from 'react'
import CardForm from '../components/CardForm'
import { useCart } from '../use-cart'

const Buying = ({ sets }) => {
  const cart = useCart()
  return <CardForm submitText="Search" sets={sets} addCard={cart.add} />
}

export default Buying
