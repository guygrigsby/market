import React from 'react'
import { css } from 'pretty-lights'
import { fetchDecks, getDeckName } from '../services/deck.js'

const inputClass = css`
  margin-left: 1rem;
  min-width: 301px;
`

const baseClass = (loading) => css`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-flow: row wrap;
  cursor: ${loading ? 'wait' : 'default'};
  padding: 1rem;
`

const FetchDeckForm = ({
  setDeckName,
  deckName,
  deck,
  ttsDeck,
  setDeck,
  setTTSDeck,
}) => {
  const [deckURL, setDeckURL] = React.useState(
    'https://deckbox.org/sets/2785835',
  )
  const [loadDecks, setLoadDecks] = React.useState(false)

  React.useEffect(() => {
    if (deckURL && loadDecks && !deckName) {
      const f = async () => {
        const name = await getDeckName(deckURL)

        setDeckName(name)
      }
      f()
    }
  }, [deckURL, loadDecks, setDeckName, deckName])

  React.useEffect(() => {
    if (deckURL && loadDecks) {
      const f = async () => {
        const decks = await fetchDecks(deckURL)
        setDeck(decks.internal)
        setTTSDeck(decks.tts)
        setDeckName(await getDeckName(deckURL))
      }
      f()
      return () => setLoadDecks(false)
    }
  }, [deckURL, setDeck, setTTSDeck, loadDecks, setDeckName])

  const getDownload = () => {
    return JSON.stringify(ttsDeck)
  }

  const handleURLChange = (val) => {
    setDeckURL(val)
    setLoadDecks(false)
    setTTSDeck(null)
  }

  return (
    <div className={baseClass(false)}>
      <label>Deck URL</label>
      <input
        className={inputClass}
        type="url"
        onChange={(e) => handleURLChange(e.target.value)}
      />
      {ttsDeck ? (
        <>
          <a
            href={`data:text/json;charset=utf-8,${getDownload()}`}
            download="deck.json"
          >
            <button>Download</button>
          </a>
          <label style={{ marginLeft: '1rem' }}>Name</label>
          <input
            className={inputClass}
            type="text"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
          />
        </>
      ) : (
        <button onClick={(e) => setLoadDecks(true)}>Get it</button>
      )}
    </div>
  )
}
export default FetchDeckForm
