import React from 'react'
import { css } from 'pretty-lights'
import PropTypes from 'prop-types'
import { useAuth } from '../AuthProvider.js'
import { Link } from 'react-router-dom'
import { B, U, R, G, W } from '../Mana.js'

const dropDownClass = (visible) => css`
  position: absolute;
  top: 100%;
  left: 0;
  height: 300px;
  width: 10em;
  background-color: black;
  display: ${visible ? 'block' : 'none'};
  z-index: 1000;
  padding: 5px;
`
const imageOptions = [<B />, <U />, <R />, <G />, <W />]
const rand = (onClick) => {
  const i = Math.ciel(Math.random() * 4)
  const r = imageOptions[i]
  r.onClick = onClick
  return imageOptions[i]
}
const avatar = css`
  cursor: pointer;
  height: 4em;
  border-radius: 100%;
`
const box = css`
  position: relative;
`

const li = css`
  flex: 1;
`
const item = css`
  margin-left: 5px;
  padding: 5px 0;
  width: 100%;
`
const AvatarMenu = ({ children, ...rest }) => {
  const [visible, setVisible] = React.useState(false)
  const auth = useAuth()

  const toggleVis = () => {
    setVisible(!visible)
  }
  const handleClick = () => {
    toggleVis()
  }
  const handleLogout = (e) => {
    auth.logout()
    toggleVis()
  }

  return (
    <div className={box}>
      <div>
        {auth.user.photoURL ? (
          <img
            onClick={handleClick}
            className={avatar}
            alt="user-avatar"
            src={auth.user.photoURL}
          />
        ) : (
          rand(handleClick)
        )}
      </div>
      <ul className={dropDownClass(visible)}>
        <li className={item}>
          <Link key="settings-link" to="/settings}">
            &#9881;
          </Link>
        </li>
        <li>
          <span className={item} key="logout-link" onClick={handleLogout}>
            Logout
          </span>
        </li>
        <li className={item}>
          <Link key="login-el" to="/login">
            Login
          </Link>
        </li>
      </ul>
    </div>
  )
}
AvatarMenu.propTypes = {
  user: PropTypes.object,
}
export default AvatarMenu
