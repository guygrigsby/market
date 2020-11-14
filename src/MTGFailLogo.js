import React from 'react'
import logoWhite from './mtgfail_white.svg'
import PropTypes from 'prop-types'
import { cx, css } from 'pretty-lights'

const logoClass = css``

export const MTGFailLogoWhite = ({ style }) => {
  return (
    <img className={cx(logoClass, style)} src={logoWhite} alt="mtg fail logo" />
  )
}
MTGFailLogoWhite.propTypes = {
  style: PropTypes.string,
}
