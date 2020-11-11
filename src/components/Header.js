import React from 'react'
import { css } from 'pretty-lights'
import PropTypes from 'prop-types'
import { B, U, R, G, W } from '../Mana.js'

const style = css`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: black;
  padding: 25px;
`
const image = css`
  height: 53px;
  width: 53px;
`
const log = css`
  margin-left: auto;
`
const Header = ({ login }) => {
  return (
    <div className={style}>
      <B style={image} />
      <U style={image} />
      <W style={image} />
      <R style={image} />
      <G style={image} />
      {login && <div className={log}>{login} </div>}
    </div>
  )
}

Header.propTypes = {
  login: PropTypes.element,
}
export default Header
