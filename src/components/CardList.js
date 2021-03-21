import React from 'react'
import { cx, css } from 'pretty-lights'
import { mana, manaHeader, SetFormatter } from '../formatters/table.js'
import ToolkitProvider from 'react-bootstrap-table2-toolkit'
import BootstrapTable from 'react-bootstrap-table-next'
import './Cardlist.css'

const box = css`
  width: 100%;
  height: auto;
  overflow-y: visible;
`
const setClass = css`
  padding-right: auto;
  align-self: center;
  height: 20px;
`
const black = css`
  fill: black;
`
const white = css`
  fill: white;
`
const cellExpand = css`
  height: 80%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`

const rowClasses = css`
  margin-top: 3px;
`

const truncateType = (typeName) => {
  const arr = typeName.split(' ')
  console.log('truncate', typeName, 'arr', arr)
  return arr[0]
}
const CardList = ({ setSelected, cards, columns, name, dark }) => {
  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      setSelected(row)
    },
  }
  const defaultColumns = [
    {
      dataField: 'name',
      text: 'Name',
      sort: true,
      headerStyle: { textAlign: 'left' },
    },
    {
      dataField: 'set',
      text: 'Set',
      sort: true,
      headerStyle: { width: '100px' },
      formatter: (cell, row) => {
        return (
          <div className={cellExpand}>
            <SetFormatter
              abrv={row.set}
              cl={cx(dark ? white : black, setClass)}
            />
          </div>
        )
      },
    },
    {
      dataField: 'mana_cost',
      text: 'Cost',
      sort: true,
      headerStyle: { width: '12%' },
      headerFormatter: () => manaHeader('Cost'),
      formatter: (cell, row) => {
        return mana(row.mana_cost, row.nicktext)
      },
    },
    {
      dataField: 'type_line',
      text: 'Type',
      sort: true,
      headerStyle: { maxWidth: '14em', textAlign: 'left' },
      formatter: (cell, row) => (dark ? truncateType(cell) : cell),
    },
  ]

  if (!dark) {
    defaultColumns.push({
      dataField: 'rarity',
      sort: true,
      headerStyle: { textAlign: 'left' },
      text: 'Rarity',
    })
  }
  return (
    <div className={box}>
      {cards && <div> Number of Cards {cards.length}</div>}
      <ToolkitProvider
        keyField="id"
        data={cards ? cards : []}
        columns={defaultColumns}
      >
        {(props) => (
          <div className="cardlist">
            <BootstrapTable
              rowEvents={rowEvents}
              rowClasses={rowClasses}
              bordered={false}
              classes={dark ? 'cardlistTableDark' : 'cardlistTable'}
              wrapperClasses={dark ? 'cardlistTableDark' : 'cardlistTable'}
              remote
              {...props.baseProps}
            />
          </div>
        )}
      </ToolkitProvider>
    </div>
  )
}

export default CardList
