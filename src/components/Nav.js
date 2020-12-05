import React from 'react'
import { Link } from 'react-router-dom'
import { cx, css } from 'pretty-lights'
import PropTypes from 'prop-types'
import { useAuth } from '../AuthProvider.js'

const style = css`
  display: flex;
  background-color: #333;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  padding: 0 2em 0 2em;
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
const Nav = () => {
  const items = [
    {
      link: '/decks',
      content: 'Deck Building',
    },
    {
      link: '/selling',
      content: 'Selling',
      authRequired: true,
    },
    {
      link: '/buying',
      content: 'Buy',
    },
    {
      link: '/login',
      content: 'Login',
      exclusiveNoAuth: true,
    },
    {
      authRequired: true,
      element: (
        <div
          key="logout-link"
          className={cx(backgroundGlow, link)}
          onClick={() => auth.logout()}
        >
          Logout
        </div>
      ),
    },
    //{
    //  link: '/settings',
    //  authRequired: true,
    //  element: (
    //    <Link
    //      className={cx(gear, cx(backgroundGlow, link))}
    //      key="settings-link"
    //      to="/settings}"
    //    >
    //      &#9881;
    //    </Link>
    //  ),
    //},
  ]
  const auth = useAuth()
  return (
    <nav className={style}>
      {items
        .filter(
          (e) =>
            (e.authRequired && auth.user) ||
            !e.authRequired ||
            (e.exclusiveNoAuth && !auth.user),
        )
        .map((e, idx) =>
          e.element ? (
            e.element
          ) : (
            <Link key={idx} to={e.link} className={cx(backgroundGlow, link)}>
              {e.content}
            </Link>
          ),
        )}
    </nav>
  )
}

Nav.propTypes = {
  items: PropTypes.array,
}

export default Nav
