import React from 'react'
import { Link } from 'react-router-dom'
import { cx, css } from 'pretty-lights'
import PropTypes from 'prop-types'

const style = css`
  display: flex;
  background-color: #333;
  justify-content: space-around;
  align-items: center;
  overflow: hidden;
  padding: 0 2em 0 2em;
  font-weight: bold;
  z-index: 1000;
  min-height: 2em;
`

const stickyClass = css`
  position: sticky;
`

const link = css`
  padding: 1rem;
  color: #f2f2f2;
  text-align: center;
  text-decoration: none;
  &:hover {
    cursor: pointer;
  }
`

const backgroundGlow = css`
  &:hover {
    cursor: pointer;
    animation: growshadow 0.25s 1 forwards;
  }
  @keyframes growshadow {
    from {
    }
    to {
      color: #000;
      background-color: #ddd;
    }
  }
`

const Nav = ({ sticky }) => {
  const items = genItems(false)
  return (
    <nav className={cx(style, sticky ? stickyClass : '')}>
      {items.map((e, idx) =>
        e.element ? (
          e.element
        ) : (
          <Link key={idx} to={e.link} className={cx(backgroundGlow, link)}>
            {e.content}
          </Link>
        ),
      )}
      {
        //loggedIn ? (
        //<div onClick={auth.logout} className={cx(backgroundGlow, link)}>
        //Logout
        //</div>
        //) : (
        //<Link to="/login" className={cx(backgroundGlow, link)}>
        //Login
        //</Link>
        //)
      }
    </nav>
  )
}

const genItems = (loggedIn) =>
  [
    //{
    //  link: '/decks',
    //  content: 'Deck Building',
    //  authRequired: false,
    //},
    //{
    //  link: '/selling',
    //  content: 'Selling',
    //  authRequired: false,
    //},
    //{
    //  link: '/buying',
    //  content: 'Buy',
    //  authRequired: false,
    //},
  ].filter((e) => (e.authRequired && loggedIn) || (!e.authRequired && !e.hide))

Nav.propTypes = {
  items: PropTypes.array,
}

export default Nav
