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
  const [loading, setLoading] = React.useState(false)
  const [deckURL, setDeckURL] = React.useState(null)

  const loadDecks = async (url) => {
    if (!url) return
    setLoading(true)
    const decks = await fetchDecks(deckURL)
    setLoading(false)
    setDeck(decks.internal)
    setTTSDeck(decks.tts)
  }

  return (
    <div className={baseClass(loading)}>
      <label>Deck URL</label>
      <input
        className={inputClass}
        type="url"
        onChange={(e) => setDeckURL(e.target.value)}
      />
      <button onClick={(e) => loadDecks(deckURL)}>Get it</button>
      {ttsDeck && (
        <a
          href={`data:text/json;${JSON.stringify(ttsDeck)}`}
          download="deck.json"
        >
          <button>Download</button>
        </a>
      )}
    </div>
  )
}
export default FetchDeckForm
