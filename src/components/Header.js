import React from 'react'
import { css } from 'pretty-lights'
import PropTypes from 'prop-types'
import { B, U, R, G, W } from '../Mana.js'
import { MTGFailLogoWhite as MTGFailLogo } from '../MTGFailLogo.js'
import { Link } from 'react-router-dom'

const box = css`
  display: flex;
  justify-content: space-evenly;
  background-color: black;
`
const style = css`
  flex: 1 1 auto;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: black;
`
const logo = css`
  align-self: baseline;
  height: 200px;
  width: 200px;
`
const image = css`
  height: 60;
  transition: transform 0.15s;
  width: 60px;
  &:hover {
    transform: scale(1.1);
  }
`
const Header = ({ setUser, setPass }) => {
  return (
    <div className={box}>
      <Link to="/">
        <MTGFailLogo style={logo} />
      </Link>
      <div className={style}>
        <B style={image} />
        <U style={image} />
        <W style={image} />
        <R style={image} />
        <G style={image} />
      </div>
    </div>
  )
}

Header.propTypes = {
  setUser: PropTypes.func,
  setPass: PropTypes.func,
}
export default Header
