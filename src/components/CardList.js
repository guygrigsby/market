import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import ToolkitProvider from 'react-bootstrap-table2-toolkit'
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.css'
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.css'
import { css } from 'pretty-lights'
import { fetchDeck } from '../services/deck.js'
import './table.css'
const progress = css`
  cursor: progress;
`

const CardList = ({ deck, setDeck }) => {
  const [deckURL, setDeckURL] = React.useState(null)
  const [tts, setTTS] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [ready, setReady] = React.useState(false)
  React.useEffect(() => {
    if (!ready || !deckURL) {
      return
    }
    const f = async () => {
      setLoading(true)
      const decks = await fetchDeck(deckURL)

      setDeck(decks.Cards)
      setLoading(false)
    }
    f()
  }, [setDeck, ready, deckURL, setTTS])
  /*
 *
    { title: 'Name', field: 'Name' },
    { title: 'Cost', field: 'Cost' },
    { title: 'Cmc', field: 'Cmc' },
    { title: 'Rarity', field: 'Rarity' },
    { title: 'Set', field: 'Set' },
 * */
  const columns = [
    {
      dataField: 'Name',
      text: 'Name',
    },
    {
      dataField: 'Set',
      text: 'Set',
    },
    {
      dataField: 'CMC',
      text: 'Cmc',
    },
    {
      dataField: 'Cost',
      text: 'Cost',
    },
    {
      dataField: 'Rarity',
      text: 'Rarity',
    },
  ]

  const cn = loading ? progress : ''

  return (
    <div className={cn}>
      <label>Deck URL</label>
      <input type="url" onChange={(e) => setDeckURL(e.target.value)} />
      <button onClick={(e) => setReady(true)}>Get it</button>
      <button href={`data:text/json;${tts}`} download disabled>
        Download
      </button>
      <ToolkitProvider
        keyField="Name"
        data={deck ? deck : []}
        columns={columns}
      >
        {(props) => {
          return (
            <BootstrapTable
              bordered={true}
              hover={true}
              condensed={true}
              bootstrap4={true}
              {...props.baseProps}
            />
          )
        }}
      </ToolkitProvider>
    </div>
  )
}
export default CardList
