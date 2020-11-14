import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useAuth } from '../AuthProvider.js'

const AuthenticatedRoute = ({ render, ...routeProps }) => {
  const { authenticated } = useAuth()
  return (
    <Route
      {...routeProps}
      render={() => (authenticated ? render() : <Redirect to="/login" />)}
    />
  )
}

AuthenticatedRoute.propTypes = {
  render: PropTypes.func,
}
export default AuthenticatedRoute
