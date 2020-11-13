import React from 'react'
import { css } from 'pretty-lights'
import PropTypes from 'prop-types'
import { B, U, R, G, W } from '../Mana.js'
import { MTGFailLogoWhite as MTGFailLogo } from '../MTGFailLogo.js'

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
  height: 100px;
  width: 100px;
`
const log = css`
  margin-left: auto;
`
const Header = ({ login }) => {
  return (
    <div className={box}>
      <MTGFailLogo style={logo} />
      <div className={style}>
        <B style={image} />
        <U style={image} />
        <W style={image} />
        <R style={image} />
        <G style={image} />
        {login && <div className={log}>{login} </div>}
      </div>
    </div>
  )
}

Header.propTypes = {
  login: PropTypes.element,
}
export default Header
