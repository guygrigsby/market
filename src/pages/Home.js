import React from 'react'
import PropTypes from 'prop-types'
import Body from '../components/Body.js'
import { useAuth } from '../AuthProvider.js'
import { login } from '../components/Login.js'

const Home = ({ initLogin }) => {
  const auth = useAuth()
  if (initLogin && !auth.authenticated) {
    console.log('In home calling login', initLogin, auth)
    login()
  }
  return <Body />
}

Home.propTypes = {
  initLogin: PropTypes.bool,
}

export default Home
