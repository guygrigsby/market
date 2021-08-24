import './firebase.js'
import React from 'react'
import ReactDOM from 'react-dom'
import './firebase.js' // This order matters
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

if (module.hot) {
  module.hot.accept()
}

ReactDOM.render(
  <ErrorBoundary>
      <App />
  </ErrorBoundary>,
  document.getElementById('root'),
)
