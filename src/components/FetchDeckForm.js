import React from 'react'
import { cx, css } from 'pretty-lights'
import { fetchDecks } from '../services/deck.js'

const inputClass = css`
  min-width: 301px;
`

const baseClass = css`
  padding: 5px;
  margin: 8px;
`

const buttonLike = css`
  background-color: #333;
  border: none;
  color: white;
  padding: 10px 25px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  margin: 4px 6px;
  font-size: 16px;
`
const hidden = css`
  display: none;
`

const FetchDeckForm = ({ decks, setLoading, setDecks }) => {
  const [tts, setTTS] = React.useState(null)
  const [deckURL, setDeckURL] = React.useState(null)

  const ttsDownload = (hide) => {
    let classes
    if (hidden) {
      classes = cx(hidden, buttonLike)
    } else {
      classes = buttonLike
    }
    return (
      <a
        className={classes}
        href={`data:text/json;${JSON.stringify(tts)}`}
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
    setDecks((prev) => {
      setTTS(decks.tts)
      return decks
    })
  }

  return (
    <div className={baseClass}>
      <label>Deck URL</label>
      <input
        className={inputClass}
        type="url"
        onChange={(e) => setDeckURL(e.target.value)}
      />
      <button onClick={(e) => loadDecks(deckURL)}>Get it</button>
      {ttsDownload(!tts)}
    </div>
  )
}
export default FetchDeckForm
