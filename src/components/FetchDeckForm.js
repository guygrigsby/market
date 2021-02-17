import React from 'react'
import { css } from 'pretty-lights'
import {
  fetchDecks,
  getDeckName,
  fetchDecksFromList,
} from '../services/deck.js'
import Tabs from './Tabs.js'

const inputClass = css`
  min-width: 301px;
`
const tabsClass = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`
const textClass = css`
  min-width: 600px;
  min-height: 600px;
`
const buttonClass = css`
  margin-top: 1em;
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
  loading,
  exportCSV,
  onError,
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

  React.useEffect(() => {
    if (decklist && loadDecks) {
      const f = async () => {
        try {
          const decks = await fetchDecksFromList(decklist, onError)
          setDeck(decks.internal.sort((a, b) => (a.name > b.name ? 1 : -1)))
          setTTSDeck(decks.tts)
          setDeckName('New Deck')
        } catch (e) {
          onError(e)
          return e
        }
      }
      f()
      setLoadDecks(false)
    }
  }, [decklist, setDeck, setTTSDeck, loadDecks, setDeckName, onError])

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

  return (
    <div className={baseClass(loading)}>
      <div className={tabsClass}>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab}>
          <div name="URL">
            <input
              className={inputClass}
              placeholder="Deck URL"
              type="url"
              onChange={(e) => handleURLChange(e.target.value)}
            />
          </div>
          <div name="List">
            <textarea
              className={textClass}
              placeholder="Deck List"
              type="text"
              onChange={(e) => handleDecklistChange(e.target.value)}
            />
          </div>
        </Tabs>
        {
          <button className={buttonClass} onClick={(e) => setLoadDecks(true)}>
            Fetch {ttsDeck ? 'New ' : ''}Deck
          </button>
        }
      </div>
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
