import React from 'react'
import { cx, css } from 'pretty-lights'
import PropTypes from 'prop-types'

const style = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const fields = css`
  height: 20px;
  padding: 5px;
  border-radius: 2px;
  border: none;
`
const field1 = css`
  margin-bottom: 10px;
`
const field2 = css`
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
        className={cx(fields, field1)}
        type="text"
        placeholder="username"
        onChange={(e) => setUser(e.target.value)}
      ></input>
      <input
        className={cx(fields, field2)}
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
