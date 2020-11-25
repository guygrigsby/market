import React from 'react'
import { css } from 'pretty-lights'
import { fetchDecks, getDeckName } from '../services/deck.js'

const inputClass = css`
  margin-left: 1rem;
  min-width: 301px;
`

const baseClass = (loading) => css`
  display: flex;
  align-items: center;
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
  const [deckURL, setDeckURL] = React.useState(null)
  const [loadDecks, setLoadDecks] = React.useState(false)

  React.useEffect(() => {
    if (deckURL && loadDecks && !deckName) {
      const f = async () => {
        const name = await getDeckName(deckURL)

        console.log('deck name in form', name)
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
  }

  return (
    <div className={baseClass(false)}>
      <label>Deck URL</label>
      <input
        className={inputClass}
        type="url"
        onChange={(e) => handleURLChange(e.target.value)}
      />
      {ttsDeck && loadDecks ? (
        <a
          href={`data:text/json;charset=utf-8,${getDownload()}`}
          download="deck.json"
        >
          <button>Download</button>
        </a>
      ) : (
        <button onClick={(e) => setLoadDecks(true)}>Get it</button>
      )}
      <label style={{ marginLeft: '1rem' }}>Name</label>
      <input
        className={inputClass}
        type="text"
        value={deckName}
        onChange={(e) => setDeckName(e.target.value)}
      />
    </div>
  )
}
export default FetchDeckForm
