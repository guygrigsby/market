import React from 'react'
import { css } from 'pretty-lights'
import PropTypes from 'prop-types'

const style = css`
  display: flex;
  align-items: center;
`
const fields = css`
  height: 30px;
  margin: 5px;
  border-radius: 2px;
  border: none;
  font-size: 1em;
`
const Login = ({ setUser, setPass }) => {
  return (
    <form className={style}>
      <input
        className={fields}
        type="email"
        placeholder="email"
        onChange={(e) => setUser(e.target.value)}
      />
      <input
        className={fields}
        type="password"
        placeholder="password"
        onChange={(e) => setPass(e.target.value)}
      />
    </form>
  )
}

Login.propTypes = {
  setUser: PropTypes.func,
  setPass: PropTypes.func,
}
export default Login
