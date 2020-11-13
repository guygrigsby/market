import React from 'react'
import logo from './mtgfail_logo_bw.svg'
import logoWhite from './mtgfail_logo_white.svg'
import PropTypes from 'prop-types'
import { cx, css } from 'pretty-lights'

const logoClass = css``

export const MTGFailLogo = ({ style }) => {
  return <img className={cx(logoClass, style)} src={logo} alt="mtg fail logo" />
}
export const MTGFailLogoWhite = ({ style }) => {
  return (
    <img className={cx(logoClass, style)} src={logoWhite} alt="mtg fail logo" />
  )
}
MTGFailLogoWhite.propTypes = {
  style: PropTypes.string,
}
MTGFailLogo.propTypes = {
  style: PropTypes.string,
}
