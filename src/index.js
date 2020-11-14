import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { ProvideAuth } from './use-auth.js'

ReactDOM.render(
  <ProvideAuth>
    <App />
  </ProvideAuth>,
  document.getElementById('root'),
)
