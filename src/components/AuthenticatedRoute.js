import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import { RootContext } from '../../RootContext'

const AuthenticatedRoute = ({ render, ...routeProps }) => {
  const { authenticated } = useContext(RootContext)
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
