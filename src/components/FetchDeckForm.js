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
  const [loadDecks, setLoadDecks] = React.useState(false)

  React.useEffect(() => {
    if (deckURL && loadDecks) {
      const f = async () => {
        console.log('loading decks', deckURL, loadDecks)
        const decks = await fetchDecks(deckURL)
        setDeck(decks.internal)
        setTTSDeck(decks.tts)
      }
      f()
    }
    setLoadDecks(false)
  }, [deckURL, setDeck, setTTSDeck, loadDecks])

  const getDownload = () => {
    console.log('tts deck download', ttsDeck)
    return JSON.stringify(ttsDeck)
  }

  return (
    <div className={baseClass(false)}>
      <label>Deck URL</label>
      <input
        className={inputClass}
        type="url"
        onChange={(e) => setDeckURL(e.target.value)}
      />
      <button onClick={(e) => setLoadDecks(true)}>Get it</button>
      {ttsDeck && (
        <a
          href={`data:text/json;charset=utf-8,${getDownload()}`}
          download="deck.json"
        >
          <button>Download</button>
        </a>
      )}
    </div>
  )
}
export default FetchDeckForm
