import React from 'react'
import { css } from 'pretty-lights'
import { mana, manaHeader, SetFormatter } from '../formatters/table.js'
import ToolkitProvider from 'react-bootstrap-table2-toolkit'
import BootstrapTable from 'react-bootstrap-table-next'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import styles from './CardList.module.css'

const box = css`
  width: 100%;
`
const black = css`
  padding-right: auto;
  align-self: center;
  height: 20px;
  fill: black;
`
const cellExpand = css`
  height: 80%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`
const CardList = ({ cards, setLoading, columns, loading }) => {
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
      formatter: (cell, row) => {
        return (
          <div className={cellExpand}>
            <SetFormatter abrv={row.set} cl={black} />
          </div>
        )
      },
    },
    {
      dataField: 'mana_cost',
      text: 'Cost',
      sort: true,
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
    },
    {
      dataField: 'rarity',
      sort: true,
      text: 'Rarity',
    },
  ]
  console.log('cards', cards)
  return (
    <div className={box}>
      <ToolkitProvider
        keyField="id"
        data={cards ? cards : []}
        columns={defaultColumns}
        search
        bootstrap4
      >
        {(props) => (
          <div className={styles.cardlist}>
            <BootstrapTable
              bordered={false}
              condensed
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
