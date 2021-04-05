import React from 'react'
import { cx, css } from 'pretty-lights'
import '../index.css'
import {
  fetchDecks,
  fetchDecklist,
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
  const [deckURL, setDeckURL] = React.useState('')
  const [decklist, setDecklist] = React.useState('')
  const [activeTab, setActive] = React.useState(1)
  const [loadDecks, setLoadDecks] = React.useState(false)
  const [file, setFile] = React.useState(undefined)

  const setActiveTab = (i) => {
    setActive(i)
  }
  const makeDecks = React.useCallback(
    async (getDeck, getName) => {
      setLoadDecks(false)
      const decks = await getDeck()
      if (decks.errors && decks.errors.length > 0) {
        setLoading(false)
        const errors = decks.errors.reduce((acc, e) => {
          acc += `\n - ${e}`
          return acc
        }, '')
        onError(errors)
      }
      if (!decks.internal) {
        onError('Unable to create deck')
        setLoading(false)
        return
      }
      if (!decks.tts) {
        onError('Unable to create tts deck')
        setLoading(false)
        return
      }
      setDeck(decks.internal.sort((a, b) => (a.name > b.name ? 1 : -1)))
      setTTSDeck(decks.tts)
      setDeckName(await getName())
      setLoading(false)
    },
    [setDeck, setTTSDeck, setDeckName, setLoading, onError],
  )

  React.useEffect(() => {
    if (loadDecks) {
      try {
        if (decklist !== '') {
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
        } else if (deckURL !== '') {
          console.log('deckURL', deckURL)
          makeDecks(
            () => fetchDecks(deckURL, onError),
            () => 'New Deck',
          )
        }
      } catch (e) {
        onError(`failed to fetch deck. Please check format.${e}`)
      }
    }
  }, [deckURL, setDeckName, onError, decklist, makeDecks, loadDecks])
  React.useEffect(() => {
    if (file) {
      const f = async () => {
        try {
          const deck = await decodeTTS(file)
          console.log('deck', deck)
          setDeck(deck.sort((a, b) => (a.name > b.name ? 1 : -1)))
        } catch (e) {
          onError(e)
        }
        setFile(null)
      }
      f()
    }
  }, [onError, file, setDeck])

  const getDownload = () => {
    return JSON.stringify(ttsDeck)
  }

  const handleURLChange = (val) => {
    const prefetch = async () => {
      try {
        const list = await fetchDecklist(val)
        console.log('prefetched list', list)
        if (list != null) {
          setDecklist(list)
        }
      } catch (e) {
        console.log('could not prefetch decklist', val, e)
      }
    }

    prefetch()
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
    if (deckURL === '' && decklist === '' && !file) {
      return
    }
    setLoading(true)
    if (decklist !== '') {
      console.log('submit decklist')
      setLoadDecks(true)
      return
    }
    if (deckURL !== '') {
      console.log('submit deckurl')
      setLoadDecks(true)
    }
  }

  const handleUpload = (e) => {
    setFile(e.target.files[0])
  }

  const handleEnter = (event) => {
    if (event.keyCode === 13) {
      handleSubmit(event)
    }
  }

  React.useEffect(() => {
    // because fuck forms
    document.addEventListener('keydown', handleEnter, false)

    return () => {
      document.removeEventListener('keydown', handleEnter, false)
    }
  })

  return (
    <div className={baseClass}>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab}>
        <input
          className={inputClass}
          id="deckurl"
          name="URL"
          placeholder="Deck URL"
          type="url"
          value={deckURL}
          onChange={(e) => handleURLChange(e.target.value)}
        />
        <textarea
          className={cx(inputClass, textClass(ttsDeck))}
          name="List"
          placeholder={`1 Ophiomancer
1 Contamination
...`}
          type="text"
          value={decklist}
          onChange={(e) => handleDecklistChange(e.target.value)}
        />
        <div name="Upload TTS deck">
          <div className={noteClass}>
            Note: This is an experimental feature.
          </div>
          <input
            className={inputClass}
            id="ttsupload"
            type="file"
            accept=".json"
            onChange={handleUpload}
          />
        </div>
      </Tabs>
      <button className={buttonClass} onClick={handleSubmit}>
        Convert
      </button>
      {ttsDeck && (
        <a
          href={`data:text/json;charset=utf-8,${getDownload()}`}
          download="deck.json"
        >
          <button>Download TTS</button>
        </a>
      )}
    </div>
  )
}
export default FetchDeckForm
