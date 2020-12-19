import React from 'react'
import { cx, css } from 'pretty-lights'
import { mana, manaHeader, SetFormatter } from '../formatters/table.js'
import ToolkitProvider from 'react-bootstrap-table2-toolkit'
import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import styles from './CardList.module.css'

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

const truncateType = (typeName) => {
  const arr = typeName.split(' ')
  console.log('truncate', typeName, 'arr', arr)
  return arr[0]
}
const CardList = ({
  setSelected,
  cards,
  setLoading,
  columns,
  loading,
  name,
  dark,
}) => {
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
      headerStyle: { maxWidth: '14em' },
      formatter: (cell, row) => (dark ? truncateType(cell) : cell),
    },
  ]

  if (!dark) {
    defaultColumns.push({
      dataField: 'rarity',
      sort: true,
      text: 'Rarity',
    })
  }
  return (
    <div className={box}>
      <div> {name && name}</div>
      <ToolkitProvider
        keyField="id"
        data={cards ? cards : []}
        columns={defaultColumns}
        search
      >
        {(props) => (
          <div className={styles.cardlist}>
            <BootstrapTable
              rowEvents={rowEvents}
              bordered={false}
              condensed
              classes={dark ? styles.cardlistTableDark : styles.cardlistTable}
              wrapperClasses={
                dark ? styles.cardlistTableDark : styles.cardlistTable
              }
              remote
              loading={loading}
              {...props.baseProps}
            />
          </div>
        )}
      </ToolkitProvider>
    </div>
  )
}

export default CardList
