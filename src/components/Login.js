import React from 'react'
import { css } from 'pretty-lights'
import { useAuth } from '../use-auth.js'
import { useStore } from '../use-store.js'

const buttonLike = css`
  border-radius: 1px;
  background-color: #333;
  border: none;
  color: white;
  padding: 0.5rem 25px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  margin-left: 1rem;
  font-size: 16px;
`
const style = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const inputClass = css`
  margin: 0.5em;
`

const Login = () => {
  const [user, setUser] = React.useState()
  const [pass, setPass] = React.useState()

  const store = useStore()

  const auth = useAuth()

  const handleLogin = (e, user, pass) => {
    e.preventDefault()
    auth.login(user, pass).catch((e) => {
      switch (e.code) {
        case 'auth/weak-password':
          console.error('Login Error', e, 'weak password')
          break
        case 'auth/user-not-found':
          console.error('Login Error', e, 'user not found attempting to signup')
          auth.signup(user, pass).then((user) => {
            store.writeUser(user)
          })
          break
        default:
          console.error('Login Error', e)
      }
    })
  }
  const userMsg = `Logged In ${JSON.stringify(auth)}`
  return (
    <form className={style} onSubmit={(e) => handleLogin(e, user, pass)}>
      {auth.user ? (
        userMsg
      ) : (
        <>
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
          <input className={buttonLike} value="Login" type="submit" />
        </>
      )}
    </form>
  )
}

export default Login
