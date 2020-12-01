import React from 'react'
import { cx, css } from 'pretty-lights'
import { mana, manaHeader, SetFormatter } from '../formatters/table.js'
import DataGrid from 'react-data-grid'
import 'react-data-grid/dist/react-data-grid.css'
const style = css`
  display: flex;
  flex-direction: column;
  height: 100%;

  > .rdg {
    flex: 1;
  }
  .highlight:hover .rdg-cell {
    background-color: #000080;
  }
`
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
const CardList = ({ setLoading, cards, columns, setDeck, cname }) => {
  const defaultColumns = [
    {
      key: 'name',
      name: 'Name',
      resizable: true,
    },
    {
      key: 'set',
      name: 'Set',
      width: 50,
      headerRenderer: () => manaHeader('Set'),
      formatter: ({ row }) => {
        return (
          <div className={cellExpand}>
            <SetFormatter abrv={row.set} cl={white} />
          </div>
        )
      },
    },
    {
      key: 'mana_cost',
      name: 'Cost',
      resizable: true,
      width: 100,
      headerRenderer: () => manaHeader('Cost'),
      formatter: ({ row }) => {
        return mana(row.mana_cost, row.nickname)
      },
    },
    {
      key: 'type_line',
      name: 'Type',
      resizable: true,
    },
    {
      key: 'cmc',
      name: 'Cmc',
      width: 100,
      resizable: true,
    },
    {
      key: 'rarity',
      name: 'Rarity',
      resizable: true,
    },
  ]
  return (
    <div className={cx(style, cname)}>
      <DataGrid
        columns={columns ? columns : defaultColumns}
        rows={cards ? cards : []}
      />
    </div>
  )
}

export default CardList
