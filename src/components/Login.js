import React from 'react'
import { css } from 'pretty-lights'
import { useAuth } from '../use-auth.js'
import { writeUser } from '../store.js'

const style = css`
  display: flex;
  align-items: center;
`
const inputClass = css`
  margin-left: 1rem;
`

const Login = () => {
  const [user, setUser] = React.useState()
  const [pass, setPass] = React.useState()

  const auth = useAuth()

  const handleLogin = (user, pass) => {
    auth.login(user, pass).catch((e) => {
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
    <form className={style} onSubmit={() => handleLogin(user, pass)}>
      <input
        className={inputClass}
        type="email"
        placeholder="Email"
        autoComplete="username"
        onChange={(e) => setUser(e.target.value)}
      />
      <input
        className={inputClass}
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        onChange={(e) => setPass(e.target.value)}
      />
    </form>
  )
}

export default Login
