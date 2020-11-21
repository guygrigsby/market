import React from 'react'
import { cx, css } from 'pretty-lights'
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

const hidden = css`
  display: none;
`

const FetchDeckForm = ({ deck, ttsDeck, setDeck, setTTSDeck }) => {
  const [loading, setLoading] = React.useState(false)
  const [deckURL, setDeckURL] = React.useState(null)

  const ttsDownload = (hide) => {
    let classes
    if (hidden) {
      classes = cx(hidden, 'button-like')
    } else {
      classes = 'buttonLike'
    }
    return (
      <a
        className={classes}
        href={`data:text/json;${JSON.stringify(ttsDeck)}`}
        download="deck.json"
      >
        Download
      </a>
    )
  }
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
      {ttsDownload(!ttsDeck)}
    </div>
  )
}
export default FetchDeckForm
