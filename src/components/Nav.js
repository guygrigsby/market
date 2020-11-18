import React from 'react'
import { Link } from 'react-router-dom'
import { css } from 'pretty-lights'
import PropTypes from 'prop-types'
import { useAuth } from '../use-auth.js'
import { writeUser } from '../store.js'
import Login from './Login.js'

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
  const [user, setUser] = React.useState()
  const [pass, setPass] = React.useState()

  const auth = useAuth()

  const handleLogin = (user, pass) => {
    auth.login(user, pass).catch((e) => {
      console.error('Login Error', e, 'trying things')
      switch (e.code) {
        case 'auth/weak-password':
          console.error('Login Error', e, 'weak password')
          break
        case 'auth/user-not-found':
          console.error('Login Error', e, 'user not found attempting to signup')
          auth.signup(user, pass).then((user) => {
            writeUser(user)
          })
          break
        default:
          console.error('Login Error', e)
      }
    })
  }
  return (
    <nav className={style}>
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
        <span className={link}>
          <Login setUser={setUser} setPass={setPass} />
          <span className={link} onClick={() => handleLogin(user, pass)}>
            Login / Signup
          </span>
        </span>
      ) : (
        <span className={link} onClick={() => auth.logout()}>
          Log Out
        </span>
      )}
    </nav>
  )
}

Nav.propTypes = {
  items: PropTypes.array,
}

export default Nav
