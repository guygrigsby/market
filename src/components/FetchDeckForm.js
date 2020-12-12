import React from 'react'
import { css } from 'pretty-lights'
import { fetchDecks, getDeckName } from '../services/deck.js'

const inputClass = css`
  margin-left: 1rem;
  min-width: 301px;
`

const baseClass = (loading) => css`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
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
        const decks = await fetchDecks(deckURL)
        setDeck(decks.internal.sort((a, b) => (a.name > b.name ? 1 : -1)))
        setTTSDeck(decks.tts)
        setDeckName(await getDeckName(deckURL))
      }
      f()
      setLoadDecks(false)
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
      <div>
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
          </>
        ) : (
          <button onClick={(e) => setLoadDecks(true)}>Get it</button>
        )}
      </div>
    </div>
  )
}
export default FetchDeckForm
