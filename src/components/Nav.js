import React from 'react'
import { Link } from 'react-router-dom'
import { css } from 'pretty-lights'
import PropTypes from 'prop-types'
import { useAuth, loginPopup, uiConfig } from '../use-auth'

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
        <div className={link} onClick={auth.logout}>
          Logout
        </div>
      ) : (
        <Link to="/login" className={link}>
          Login
        </Link>
      )}
    </nav>
  )
}

Nav.propTypes = {
  items: PropTypes.array,
}

export default Nav
