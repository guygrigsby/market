import './firebase.js'
import React from 'react'
import ReactDOM from 'react-dom'
import './firebase.js' // This order matters
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import { ProvideShoppingCart } from './use-cart.js'
import './index.css'

if (module.hot) {
  module.hot.accept()
}

ReactDOM.render(
  <ErrorBoundary>
    <ProvideShoppingCart>
      <App />
    </ProvideShoppingCart>
  </ErrorBoundary>,
  document.getElementById('root'),
)
