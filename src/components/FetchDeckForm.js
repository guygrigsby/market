import React from 'react'
import { cx, css } from 'pretty-lights'
import '../index.css'
import {
  fetchDecks,
  fetchDecksFromList,
  isValid,
  decodeTTS,
} from '../services/deck.js'
import Tabs from './Tabs.js'

const noteClass = css`
  padding: 1em;
`

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
  const [upload, setUpload] = React.useState(false)
  const uploadRef = React.useRef()

  const setActiveTab = (i) => {
    setActive(i)
  }
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
      try {
        if (deckURL) {
          makeDecks(
            () => fetchDecks(deckURL, onError),
            () => 'New Deck',
          )
        } else if (decklist) {
          try {
            const normalized = isValid(decklist)
            console.log('normalized', normalized)
            makeDecks(
              () => fetchDecksFromList(normalized, onError),
              () => 'New Deck',
            )
          } catch (e) {
            onError(e)
            return
          }
        }
      } catch (e) {
        onError(`failed to fetch deck. Please check format.${e}`)
      }
    }
  }, [deckURL, setDeckName, onError, decklist, makeDecks, loadDecks])
  React.useEffect(() => {
    if (upload) {
      setUpload(false)
      const f = async () => {
        try {
          await decodeTTS(uploadRef.current.file)
        } catch (e) {
          onError(e)
        }
      }
      f()
    }
  }, [setUpload, upload, onError])

  const getDownload = () => {
    return JSON.stringify(ttsDeck)
  }

  const handleURLChange = (val) => {
    console.log('set deck url', val)
    setDeckURL(val)
    setLoadDecks(false)
    setTTSDeck(null)
  }

  const handleDecklistChange = (list) => {
    console.log('set decklist')
    setDecklist(list)
    setLoadDecks(false)
    setTTSDeck(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!deckURL && !decklist) {
      return
    }
    setLoading(true)
    if (upload) {
      console.log('submit upload')
      setUpload(true)
      return
    }
    if (decklist) {
      console.log('submit decklist')
      setLoadDecks(true)
      return
    }
    if (deckURL) {
      console.log('submit deckurl')
      setLoadDecks(true)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={baseClass}>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab}>
        <input
          className={inputClass}
          id="deckurl"
          name="URL"
          placeholder="Deck URL"
          type="url"
          onChange={(e) => handleURLChange(e.target.value)}
        />
        <textarea
          className={cx(inputClass, textClass(ttsDeck))}
          name="List"
          placeholder={`1 Ophiomancer
1 Contamination
...`}
          type="text"
          onChange={(e) => handleDecklistChange(e.target.value)}
        />
        <div name="Upload TTS deck">
          <div className={noteClass}>
            Note: This is an experimental feature.
          </div>
          <input
            className={inputClass}
            id="ttsupload"
            ref={uploadRef}
            type="file"
            accept=".json"
          />
        </div>
      </Tabs>
      <input type="submit" className={buttonClass} value="Convert" />
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
