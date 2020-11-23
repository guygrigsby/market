import React from 'react'
import { css } from 'pretty-lights'
import { fetchDecks } from '../services/deck.js'

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

const FetchDeckForm = ({ deck, ttsDeck, setDeck, setTTSDeck }) => {
  const [deckURL, setDeckURL] = React.useState(null)
  const [lastTTS, setLastTTS] = React.useState(ttsDeck)

  const loadDecks = async (url) => {
    if (!url) return
    const decks = await fetchDecks(deckURL)
    setDeck(decks.internal)
    setTTSDeck(decks.tts)
  }

  React.useEffect(() => {
    if (ttsDeck) {
      setLastTTS(ttsDeck)
    }
  }, [ttsDeck])

  console.log('ttsdeck', JSON.stringify(lastTTS))

  return (
    <div className={baseClass(false)}>
      <label>Deck URL</label>
      <input
        className={inputClass}
        type="url"
        onChange={(e) => setDeckURL(e.target.value)}
      />
      <button onClick={(e) => loadDecks(deckURL)}>Get it</button>
      {lastTTS && (
        <a
          href={`data:text/json;charset=utf-8,${JSON.stringify(lastTTS)}`}
          download="deck.json"
        >
          <button>Download</button>
        </a>
      )}
    </div>
  )
}
export default FetchDeckForm
