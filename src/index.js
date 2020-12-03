import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { ProvideAuth } from './use-auth.js'
import { ProvideStore } from './use-store.js'
import './index.css'

ReactDOM.render(
  <ProvideStore>
    <ProvideAuth>
      <App />
    </ProvideAuth>
  </ProvideStore>,
  document.getElementById('root'),
)
