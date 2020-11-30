import React from 'react'
import { Link } from 'react-router-dom'
import { css } from 'pretty-lights'
import PropTypes from 'prop-types'

const style = css`
  display: flex;
  background-color: #333;
  justify-content: space-evenly;
  overflow: hidden;
`

const link = css`
  display: inline-block;
  padding-top: 1rem;
  padding-bottom: 1rem;
  vertical-align: middle;
  color: #f2f2f2;
  text-align: center;
  text-decoration: none;
  &:hover: {
    background-color: #ddd;
    color: black;
  }
`

const Nav = ({ items }) => {
  return (
    <nav className={style}>
      {items.map((e, idx) => {
        return (
          <Link key={idx} to={e.link} className={link}>
            {e.content}
          </Link>
        )
      })}
    </nav>
  )
}

Nav.propTypes = {
  items: PropTypes.array,
}

export default Nav
