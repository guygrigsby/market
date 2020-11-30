import React from 'react'
import { fetchDecks } from '../services/deck.js'
import { css } from 'pretty-lights'
import PropTypes from 'prop-types'
import { B, U, R, G, W } from '../Mana.js'
import { MTGFailLogoWhite as MTGFailLogo } from '../MTGFailLogo.js'
import { Link } from 'react-router-dom'

const box = css`
  display: flex;
  justify-content: space-evenly;
  background-color: black;
`
const style = css`
  flex: 1 1 auto;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: black;
`
const logo = css`
  margin-left: 1em;
  height: 100px;
  width: 100px;
`
const image = css`
  height: 45px;
  transition: transform 0.15s;
  width: 45px;
  z-offset: 99;
  &:hover {
    transform: scale(1.1);
  }
`
const log = css`
  margin-left: auto;
`

const OMNOM = 'https://deckbox.org/sets/2785835'

const Header = ({ setDeck, setTTSDeck, login }) => {
  const [reload, setReload] = React.useState(false)

  React.useEffect(() => {
    if (!reload) return
    const f = async () => {
      const decks = await fetchDecks(reload)

      setTTSDeck(decks.tts)
      setDeck(decks.internal.sort((a, b) => (a.name > b.name ? 1 : -1)))
    }
    f()
    setReload(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload])

  return (
    <div className={box}>
      <Link to="/">
        <MTGFailLogo style={logo} />
      </Link>
      <div className={style}>
        <B style={image} />
        <U style={image} />
        <W style={image} />
        <span onClick={() => setReload(OMNOM)}>
          <R style={image} />
        </span>
        <G style={image} />
        {login && <div className={log}>{login} </div>}
      </div>
    </div>
  )
}

Header.propTypes = {
  login: PropTypes.element,
}
export default Header
