import React from 'react'
import { ReactComponent as Logo } from './mtgfail_white.svg'
import PropTypes from 'prop-types'
import { cx, css } from 'pretty-lights'

const logoClass = css`
  text-decoration: none;
  &:hover {
    cursor: pointer;
  }
`

export const MTGFailLogoWhite = ({ style }) => {
  return <Logo className={cx(logoClass, style)} />
}
MTGFailLogoWhite.propTypes = {
  style: PropTypes.string,
}
