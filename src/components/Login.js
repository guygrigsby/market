import React from 'react'
import { cx, css } from 'pretty-lights'
import PropTypes from 'prop-types'
import { toggleSignIn } from '../auth.js'

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
  font-size: 1em;
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

  return (
    <form
      className={style}
      onSubmit={(e) =>
        e.preventDefault && e.stopPropagation && toggleSignIn(user, pass)
      }
    >
      <input
        className={cx(fields, field1)}
        type="email"
        placeholder="email"
        onChange={(e) => setUser(e.target.value)}
      />
      <input
        className={cx(fields, field2)}
        type="password"
        placeholder="password"
        onChange={(e) => setPass(e.target.value)}
      />
      <input type="submit" />
    </form>
  )
}

Header.propTypes = {
  login: PropTypes.element,
}
export default Header
