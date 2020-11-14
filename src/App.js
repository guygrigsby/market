import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Header from './components/Header.js'
import Nav from './components/Nav.js'
import Home from './pages/Home.js'
import Page from './pages/Page.js'
import Selling from './pages/Selling.js'
import Body from './components/Body.js'
const menu = [
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
  {
    link: '/login',
    content: 'Login',
  },
]

const App = () => {
  return (
    <Router>
      <Header />
      <Nav items={menu} />
      <Page>
        <Switch>
          <Route path="/selling">
            <Selling />
          </Route>
          <Route path="/singles">
            <Body>{'singles'}</Body>
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </Page>
    </Router>
  )
}

export default App
