import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import AuthProvider from './AuthProvider.js'
import { ProvideStore } from './use-store.js'
import { ProvideShoppingCart } from './use-cart.js'
import './index.css'

ReactDOM.render(
  <AuthProvider>
    <ProvideShoppingCart>
      <ProvideStore>
        <App />
      </ProvideStore>
    </ProvideShoppingCart>
  </AuthProvider>,
  document.getElementById('root'),
)
