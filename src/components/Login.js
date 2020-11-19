import React from 'react'
import { css } from 'pretty-lights'

const style = css`
  display: flex;
  align-items: center;
`
const fields = css`
  height: 30px;
  margin: 5px;
  border-radius: 1px;
  border: none;
  font-size: 1em;
`
const Login = ({ setUser, setPass }) => {
  return (
    <form className={style}>
      <details>
        <summary>Login</summary>

        <input
          className={fields}
          type="email"
          placeholder="Email"
          autoComplete="username"
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          className={fields}
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          onChange={(e) => setPass(e.target.value)}
        />
      </details>
    </form>
  )
}

export default Login
