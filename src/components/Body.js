import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'pretty-lights'

const style = css`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  margin-left: 20px;
`

const Body = ({ children }) => {
  return <div className={style}></div>
}
Body.propTypes = {
  children: PropTypes.any,
}

export default Body
