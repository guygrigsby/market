import React from 'react'
import { css } from 'pretty-lights'
import { fetchDecks, getDeckName } from '../services/deck.js'

const inputClass = css`
  min-width: 301px;
`
const buttonClass = css`
  margin-left: 1em;
`
const baseClass = (loading) => css`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
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
  loading,
  exportCSV,
  onError,
}) => {
  const [deckURL, setDeckURL] = React.useState(
    'https://cors-anywhere.herokuapp.com/https://deckbox.org/sets/2785835',
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
        try {
          const decks = await fetchDecks(deckURL, onError)
          setDeck(decks.internal.sort((a, b) => (a.name > b.name ? 1 : -1)))
          setTTSDeck(decks.tts)
          setDeckName(await getDeckName(deckURL))
        } catch (e) {
          onError(e)
          return e
        }
      }
      f()
      setLoadDecks(false)
    }
  }, [deckURL, setDeck, setTTSDeck, loadDecks, setDeckName, onError])

  const getDownload = () => {
    return JSON.stringify(ttsDeck)
  }

  const handleURLChange = (val) => {
    setDeckURL(val)
    setLoadDecks(false)
    setTTSDeck(null)
  }

  return (
    <div className={baseClass(loading)}>
      <input
        className={inputClass}
        placeholder="Deck URL"
        type="url"
        onChange={(e) => handleURLChange(e.target.value)}
      />
      {
        <button className={buttonClass} onClick={(e) => setLoadDecks(true)}>
          Fetch {ttsDeck ? 'New ' : ''}Deck
        </button>
      }

      {ttsDeck && (
        <a
          href={`data:text/json;charset=utf-8,${getDownload()}`}
          download="deck.json"
          className={buttonClass}
        >
          <button>Download TTS</button>
        </a>
      )}

      {ttsDeck && <button className={buttonClass}>Export CSV</button>}
    </div>
  )
}
export default FetchDeckForm
