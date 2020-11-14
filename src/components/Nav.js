import React from 'react'
import { Link } from 'react-router-dom'
import { cx, css } from 'pretty-lights'
import PropTypes from 'prop-types'
import { useAuth } from '../use-auth.js'
import Login from './Login.js'

const style = css`
  flex: 1 1 auto;
  display: flex;
  background-color: #333;
  justify-content: space-evenly;
  overflow: hidden;
  padding: 0 30px 0 30px;
`

const link = css`
  flex: 0 1 auto;
  color: #f2f2f2;
  text-align: center;
  padding: 14px 0 16px 0;
  text-decoration: none;
  &:hover {
    background-color: #ddd;
    color: black;
  }
`
const log = css`
  display: flex;
`

const Nav = ({ items }) => {
  const [user, setUser] = React.useState('')
  const [pass, setPass] = React.useState('')
  const auth = useAuth()
  return (
    <nav className={style}>
      <span className={style}>
        {items.map((e, idx) => {
          return (
            <Link key={idx} to={e.link} className={link}>
              {e.content}
            </Link>
          )
        })}
      </span>
      {!auth.user ? (
        <span className={log}>
          <Login setUser={setUser} setPass={setPass} />
          <span className={link} onClick={() => auth.login(user, pass)}>
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
