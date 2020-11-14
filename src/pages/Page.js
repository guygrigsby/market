import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'pretty-lights'

const box = css`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
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
