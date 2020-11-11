import React from 'react'
import { css } from 'pretty-lights'
import PropTypes from 'prop-types'

const style = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const field1 = css`
  height: 20px;
  margin-bottom: 10px;
`
const field2 = css`
  height: 20px;
  align-self: flex-end;
`
const Header = ({ login }) => {
  const [user, setUser] = React.useState('')
  const [pass, setPass] = React.useState('')
  const hashPass = (clear) => setPass(clear)
  const signin = () => console.log('signin', user, pass)

  return (
    <form className={style} onSubmit={signin}>
      <input
        className={field1}
        type="text"
        placeholder="username"
        onChange={(e) => setUser(e.target.value)}
      ></input>
      <input
        className={field2}
        type="password"
        placeholder="password"
        onChange={(e) => hashPass(e.target.value)}
      ></input>
    </form>
  )
}

Header.propTypes = {
  login: PropTypes.element,
}
export default Header
