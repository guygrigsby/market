import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import ToolkitProvider from 'react-bootstrap-table2-toolkit'
import { css } from 'pretty-lights'
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.css'
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.css'
//import './bootstrap4.css'

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

const CardList = ({ setLoading, deck, setDeck }) => {
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
  const rowClasses = (row, rowIndex) => {
    return css`
      max-height: 100px;
      &:hover {
        height: auto;
      }
    `
  }

  return (
    <ToolkitProvider keyField="name" data={deck ? deck : []} columns={columns}>
      {(props) => {
        return (
          <BootstrapTable
            bordered={true}
            hover={true}
            condensed={true}
            rowEvents={rowEvents}
            bootstrap4={true}
            {...props.baseProps}
          />
        )
      }}
    </ToolkitProvider>
  )
}
export default CardList
