import React from 'react'
import { useTable } from 'react-table'
import { css } from 'pretty-lights'

const style = css`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`
const imageFormatter = (cell, row, rowIndex) => {
  return (
    <img
      key={`${rowIndex}-${row.name}`}
      src={row.image_uris.small}
      alt="card"
    ></img>
  )
}

const CardList = ({ setLoading, cards, columns, setDeck }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns: columns ? columns : defaultColumns,
    data: cards ? cards : [],
  })

  return (
    <div className={style}>
      <table {...getTableProps()} style={{ width: '100%' }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
const defaultColumns = [
  {
    accessor: 'image_uris.small',
    Header: 'Image',
    formatter: (cell, row, rowIndex) => {
      console.log('cell', cell)
      return imageFormatter(cell, row, rowIndex)
    },
  },
  {
    accessor: 'name',
    Header: 'Name',
  },
  {
    accessor: 'set',
    Header: 'Set',
  },
  {
    accessor: 'cmc',
    Header: 'Cmc',
  },
  {
    accessor: 'cost',
    Header: 'Cost',
  },
  {
    accessor: 'rarity',
    Header: 'Rarity',
  },
]
export default CardList
