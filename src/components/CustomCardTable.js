import React from 'react'
import { css } from 'pretty-lights'

const thumbnailsClass = css`
  &:hover {
    height: auto;
  }
`

const rowEvents = {
  onClick: (e, row, rowIndex) => {},
}

const imageFormatter = (cell, row, rowIndex) => {
  return (
    <img
      key={`${rowIndex}-${row.name}`}
      src={row.image_uris.small}
      alt="card"
    ></img>
  )
}
const columns = [
  {
    dataField: 'image_uris.small',
    text: 'Image',
    formatter: (cell, row, rowIndex) => {
      console.log('cell', cell)
      return imageFormatter(cell, row, rowIndex)
    },
  },
  {
    dataField: 'name',
    text: 'Name',
    sort: true,
  },
  {
    dataField: 'set',
    text: 'Set',
    sort: true,
  },
  {
    dataField: 'cmc',
    text: 'Cmc',
    sort: true,
  },
  {
    dataField: 'cost',
    text: 'Cost',
  },
  {
    dataField: 'rarity',
    text: 'Rarity',
    sort: true,
  },
]

const base = css`
  width: 100%;
  padding-bottom: 20px;
`

const body = css`
  background-color: lightGrey;
`

const rows = css`
  width: 100%;
`

const CustomCardTable = ({ setLoading, decks, setDecks }) => {
  console.log('table', decks)
  return (
    <table className={base}>
      <thead className={base}>
        <tr className={base}>
          {columns.map((e, i) => (
            <th key={i}>{e.text}</th>
          ))}
        </tr>
      </thead>
      <tbody className={body}>
        {decks &&
          decks.internal.map((row, rowIdx) => {
            return (
              <tr key={rowIdx} className={rows}>
                {columns.map((col, colIdx) => (
                  <td key={`${rowIdx}-${colIdx}`}>
                    {col.formatter
                      ? col.formatter(row[col.dataField], row, rowIdx)
                      : row[col.dataField]}
                  </td>
                ))}
              </tr>
            )
          })}
      </tbody>
    </table>
  )
}
export default CustomCardTable
