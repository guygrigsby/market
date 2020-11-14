import React from 'react'
import PropTypes from 'prop-types'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import Header from './components/Header.js'
import Nav from './components/Nav.js'
import Home from './pages/Home.js'
import Page from './pages/Page.js'
import Selling from './pages/Selling.js'
import Body from './components/Body.js'
import Profile from './pages/Profile.js'
import { useAuth } from './AuthProvider.js'
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
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/selling">
            <Selling />
          </Route>
          <Route path="/singles"></Route>
          <Body>{'singles'}</Body>
          <Route path="/login">
            <Home initAuth={true} />
          </Route>

          <PrivateRoute path="/protected">
            <Profile />
          </PrivateRoute>
        </Switch>
      </Page>
    </Router>
  )
}
const PrivateRoute = ({ children, ...rest }) => {
  let auth = useAuth()
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  )
}
PrivateRoute.propTypes = {
  children: PropTypes.object,
}

export default App
