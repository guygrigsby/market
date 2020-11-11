import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import RootContext from './RootContext.js'

ReactDOM.render(
  <React.StrictMode>
    <RootContext>
      <App />
    </RootContext>
  </React.StrictMode>,
  document.getElementById('root'),
)
