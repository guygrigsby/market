import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Header from './components/Header.js'
import Nav from './components/Nav.js'
import Home from './pages/Home.js'
const menu = [
  {
    link: '/',
    content: 'Home',
  },
  {
    link: '/selling',
    content: 'Selling',
  },
  {
    link: '/singles',
    content: 'Singles',
  },
  {
    link: '/about',
    content: 'About',
  },
]
const App = () => {
  return (
    <Router>
      <Header />
      <Nav items={menu} />
      <Switch>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
