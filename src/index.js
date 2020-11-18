import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { ProvideAuth } from './use-auth.js'
import './index.css'

ReactDOM.render(
  <ProvideAuth>
    <App />
  </ProvideAuth>,
  document.getElementById('root'),
)
