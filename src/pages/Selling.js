import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import ToolkitProvider from 'react-bootstrap-table2-toolkit'
import filterFactory, {
  selectFilter,
  textFilter,
  numberFilter,
} from 'react-bootstrap-table2-filter'
import CardForm from '../components/CardForm'
import { css } from 'pretty-lights'
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.css'
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.css'

const page = css`
  display: flex;
  flex: 1 1 auto;
  flex-flow: column wrap;
  justify-content: space-between;
  align-items: center;
`
const selectOptions = {
  0: 'M',
  1: 'NM',
  2: 'LP',
  3: 'MP',
  4: 'HP',
}
const Selling = ({ cards, addCard, removeCard }) => {
  React.useEffect(() => {})

  const columns = [
    {
      dataField: 'id',
      text: 'ID',
    },
    {
      dataField: 'name',
      text: 'Name',
      filter: textFilter(),
    },
    {
      dataField: 'set',
      text: 'Set',
      filter: textFilter(),
    },
    {
      dataField: 'condition',
      text: 'Condition',
      formatter: (cell) => selectOptions[cell],
      filter: selectFilter({
        options: selectOptions,
      }),
    },
    {
      dataField: 'price',
      text: 'My Price',
      filter: numberFilter(),
    },
  ]
  console.log('cards in Selling page', cards)

  return (
    <div className={page}>
      <CardForm addCard={addCard} removeCard={removeCard} />
      <ToolkitProvider
        keyField="id"
        data={cards ? cards : []}
        columns={columns}
      >
        {(props) => {
          return (
            <BootstrapTable
              filter={filterFactory()}
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
export default Selling
