import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'pretty-lights'

const box = css`
  display: flex;
  width: 100%;
  margin: 15px;
  padding: 10px;
`

const Page = ({ children, ...rest }) => {
  return (
    <div className={`page ${box}`} {...rest}>
      {children}
    </div>
  )
}
Page.propTypes = {
  children: PropTypes.object,
}
export default Page
