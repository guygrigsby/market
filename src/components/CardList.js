import React from 'react'
import { css } from 'pretty-lights'
import { mana, manaHeader } from '../formatters/table.js'
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

const CardList = ({ setLoading, cards, columns, setDeck }) => {
  return (
    <div className={style}>
      <DataGrid
        columns={columns ? columns : defaultColumns}
        rows={cards ? cards : []}
      />
    </div>
  )
}
const defaultColumns = [
  //{
  //  key: 'image_uris.small',
  //  name: 'Image',
  //  formatter: ({ row }) => {
  //    const u = row.image_uris.small
  //    console.log(u)
  //    return <Image key={row.id} value={u} />
  //  },
  //},
  {
    key: 'name',
    name: 'Name',
    resizable: true,
  },
  {
    key: 'set',
    name: 'Set',
    resizable: true,
  },
  {
    key: 'prices.usd',
    name: 'Price',
    resizable: true,
  },
  {
    key: 'mana_cost',
    name: 'Cost',
    resizable: true,
    width: 100,
    headerRenderer: () => manaHeader('Cost'),
    formatter: ({ row }) => {
      return mana(row.mana_cost)
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
export default CardList
