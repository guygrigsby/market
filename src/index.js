import React from 'react'
import ReactDOM from 'react-dom'
import './firebase.js' // This order matters
import App from './App'
import FirebaseProvider from './AuthProvider.js'
import { ProvideShoppingCart } from './use-cart.js'
import './index.css'
ReactDOM.render(
  <FirebaseProvider>
    <ProvideShoppingCart>
      <App />
    </ProvideShoppingCart>
  </FirebaseProvider>,
  document.getElementById('root'),
)
