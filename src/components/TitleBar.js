import React from 'react'
import { css } from 'pretty-lights'
import { getDeckName } from '../services/deck.js'
const inputClass = css`
  margin-left: 1rem;
  min-width: 301px;
`

const TitleBar = ({ deckName, setDeckName, url }) => {
  React.useEffect(() => {
    if (!url || !deckName) return
    const f = async () => {
      const name = await getDeckName(url)
      setDeckName(name)
    }
    f()
  }, [url, setDeckName, deckName])

  return (
    <>
      <label style={{ marginLeft: '1rem' }}>Deck Name</label>
      <input
        className={inputClass}
        type="text"
        value={deckName}
        onChange={(e) => setDeckName(e.target.value)}
      />
    </>
  )
}

export default TitleBar
