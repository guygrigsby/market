import './firebase.js'
import React from 'react'
import ReactDOM from 'react-dom'
import './firebase.js' // This order matters
import App from './App'
import { ProvideShoppingCart } from './use-cart.js'
import './index.css'
ReactDOM.render(
    <ProvideShoppingCart>
      <App />
    </ProvideShoppingCart>,
  document.getElementById('root'),
)
