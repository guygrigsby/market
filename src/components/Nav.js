import React from 'react'
import { Link } from 'react-router-dom'
import { css } from 'pretty-lights'
import PropTypes from 'prop-types'
import { useAuth } from '../use-auth.js'

const style = css`
  display: flex;
  background-color: #333;
  justify-content: space-evenly;
  overflow: hidden;
`

const link = css`
  color: #f2f2f2;
  text-align: center;
  padding: 14px 0 16px 0;
  text-decoration: none;
  &:hover: {
    background-color: #ddd;
    color: black;
  }
`

const Nav = ({ items }) => {
  const auth = useAuth()
  console.log('auth obj', auth)
  return (
    <nav className={style}>
      <span />
      {items.map((e, idx) => {
        return (
          <Link key={idx} to={e.link} className={link}>
            {e.content}
          </Link>
        )
      })}
      <span
        className={link}
        onClick={() => auth.signup('guy@grigsby.dev', 'password')}
      >
        Sign Up
      </span>
      {!auth.user ? (
        <span
          className={link}
          onClick={() => auth.login('guy@grigsby.dev', 'password')}
        >
          Log In
        </span>
      ) : (
        <span className={link} onClick={() => auth.logout()}>
          Log Out
        </span>
      )}
      <span />
    </nav>
  )
}

Nav.propTypes = {
  items: PropTypes.array,
}

export default Nav
