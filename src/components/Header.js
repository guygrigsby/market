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
  align-self: baseline;
  height: 200px;
  width: 200px;
`
const image = css`
  height: 60;
  transition: transform 0.15s;
  width: 60px;
  A
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
    const f = async () => {
      if (reload) {
        const decks = await fetchDecks(reload)
        console.log('clicky', decks)
        setTTSDeck(decks.tts)
        setDeck(decks.internal)
      }
    }
    f()
  }, [reload, setDeck, setTTSDeck])

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
