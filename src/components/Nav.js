import React from 'react'
import { Link } from 'react-router-dom'
import { css } from 'pretty-lights'
import PropTypes from 'prop-types'
import { useAuth } from '../use-auth'

const style = css`
  display: flex;
  background-color: #333;
  justify-content: space-evenly;
  overflow: hidden;
`

const link = css`
  display: inline-block;
  padding-top: 1rem;
  padding-bottom: 1rem;
  vertical-align: middle;
  color: #f2f2f2;
  text-align: center;
  text-decoration: none;
  &:hover: {
    background-color: #ddd;
    color: black;
  }
`

const Nav = ({ items }) => {
  const auth = useAuth()
  return (
    <nav className={style}>
      {items.map((e, idx) => {
        return (e.authRequired && auth.user) || !e.authRequired ? (
          <Link key={idx} to={e.link} className={link}>
            {e.content}
          </Link>
        ) : null
      })}
      {auth.user ? (
        auth.user.isAnonymous ? (
          <div className={link} onClick={auth.signup}>
            Signup
          </div>
        ) : (
          <div className={link} onClick={auth.logout}>
            Logout {auth.user.email}
          </div>
        )
      ) : (
        <div className={link} onClick={auth.login}>
          {/*
        This shouldn't happen unless something goes wrong, but have it just in case
        */}
          Login
        </div>
      )}
    </nav>
  )
}

Nav.propTypes = {
  items: PropTypes.array,
}

export default Nav
