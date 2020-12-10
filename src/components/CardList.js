import React from 'react'
import { css } from 'pretty-lights'
import { mana, manaHeader, SetFormatter } from '../formatters/table.js'
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit'
import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'

const { SearchBar } = Search
const white = css`
  padding-right: auto;
  align-self: center;
  height: 75%;
  fill: white;
`

const cellExpand = css`
  height: 80%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`
const CardList = ({ cards, setLoading, columns, ctext }) => {
  const defaultColumns = [
    {
      dataField: 'text',
      text: 'Name',
      resizable: true,
    },
    {
      dataField: 'set',
      text: 'Set',
      width: 50,
      headerRenderer: () => manaHeader('Set'),
      formatter: (cell, row) => {
        return (
          <div className={cellExpand}>
            <SetFormatter abrv={row.set} cl={white} />
          </div>
        )
      },
    },
    {
      dataField: 'mana_cost',
      text: 'Cost',
      resizable: true,
      width: 100,
      headerRenderer: () => manaHeader('Cost'),
      formatter: (cell, row) => {
        return mana(row.mana_cost, row.nicktext)
      },
    },
    {
      dataField: 'type_line',
      text: 'Type',
      resizable: true,
    },
    {
      dataField: 'cmc',
      text: 'Cmc',
      width: 100,
      resizable: true,
    },
    {
      dataField: 'rarity',
      text: 'Rarity',
      resizable: true,
    },
  ]
  console.log('cards', cards)
  return (
    <ToolkitProvider
      keyField="id"
      data={cards ? cards : []}
      columns={defaultColumns}
      search
      bootstrap4
    >
      {(props) => (
        <div>
          <h3>Input something at below input field:</h3>
          <SearchBar {...props.searchProps} />
          <hr />
          <BootstrapTable {...props.baseProps} />
        </div>
      )}
    </ToolkitProvider>
  )
}

export default CardList
