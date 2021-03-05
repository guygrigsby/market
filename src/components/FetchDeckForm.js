import React from 'react'
import { cx, css } from 'pretty-lights'
import '../index.css'
import {
  fetchDecks,
  getDeckName,
  fetchDecksFromList,
} from '../services/deck.js'
import Tabs from './Tabs.js'

const buttonClass = css`
  color: #f2f2f2;
  text-align: center;
  text-decoration: none;
  &:hover {
    cursor: pointer;
  }
  background-color: #333;
  margin: 1em 1em 0 0;
  padding: 0.5em 1em;
`
const baseClass = css`
  width: 100%;
  padding: 1em;
`

const inputClass = css`
  width: 100%;
  float: middle;
  box-sizing: border-box;
  resize: vertical;
`
const textClass = (deckLoaded) => {
  const style = css`
    ${deckLoaded ? 'height:4em;' : 'min-height: 20em;'}
  `
  return style
}

const FetchDeckForm = ({
  setDeckName,
  deckName,
  deck,
  ttsDeck,
  setDeck,
  setTTSDeck,
  exportCSV,
  onError,
  setLoading,
}) => {
  const [deckURL, setDeckURL] = React.useState(null)
  const [decklist, setDecklist] = React.useState(null)
  const [activeTab, setActive] = React.useState(0)
  const [loadDecks, setLoadDecks] = React.useState(false)

  const setActiveTab = (i) => {
    setActive(i)
  }

  React.useEffect(() => {
    if (deckURL && loadDecks && !deckName) {
      const f = async () => {
        const name = await getDeckName(deckURL)

        setDeckName(name)
      }
      f()
    }
  }, [deckURL, loadDecks, setDeckName, deckName])

  const makeDecks = React.useCallback(
    async (getDeck, getName) => {
      const decks = await getDeck()
      setDeck(decks.internal.sort((a, b) => (a.name > b.name ? 1 : -1)))
      setTTSDeck(decks.tts)
      setDeckName(await getName())
      setLoadDecks(false)
      setLoading(false)
    },
    [setDeck, setTTSDeck, setDeckName, setLoading],
  )

  React.useEffect(() => {
    if (loadDecks) {
      if (deckURL) {
        makeDecks(
          () => fetchDecks(deckURL, onError),
          () => getDeckName(deckURL),
        )
      } else if (decklist) {
        makeDecks(
          () => fetchDecksFromList(decklist, onError),
          () => 'New Deck',
        )
      }
    }
  }, [deckURL, setDeckName, onError, decklist, makeDecks, loadDecks])

  const getDownload = () => {
    return JSON.stringify(ttsDeck)
  }

  const handleURLChange = (val) => {
    setDeckURL(val)
    setLoadDecks(false)
    setTTSDeck(null)
  }

  const handleDecklistChange = (list) => {
    setDecklist(list)
    setLoadDecks(false)
    setTTSDeck(null)
  }

  const handleLoadDecks = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!deckURL && !decklist) {
      return
    }
    setLoading(true)
    setLoadDecks(true)
  }

  return (
    <form onSubmit={handleLoadDecks} className={baseClass}>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab}>
        <input
          className={inputClass}
          name="URL"
          placeholder="Deck URL"
          type="url"
          onChange={(e) => handleURLChange(e.target.value)}
        />
        <textarea
          className={cx(inputClass, textClass(ttsDeck))}
          name="List"
          placeholder={`1 x Ophiomancer
1 x Contamination
...`}
          type="text"
          onChange={(e) => handleDecklistChange(e.target.value)}
        />
      </Tabs>
      <input type="submit" className={buttonClass} value="Fetch Deck" />
      {ttsDeck && (
        <a
          href={`data:text/json;charset=utf-8,${getDownload()}`}
          download="deck.json"
        >
          <button>Download TTS</button>
        </a>
      )}
    </form>
  )
}
export default FetchDeckForm
