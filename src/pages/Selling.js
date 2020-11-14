import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit'

const Selling = () => {
  const products = [
    { id: '1', name: 'thing' },
    { id: '2', name: 'thing' },
    { id: '3', name: 'thing' },
    { id: '4', name: 'thing' },
    { id: '5', name: 'thing' },
    { id: '6', name: 'thing' },
    { id: '7', name: 'thing' },
  ]
  const columns = [
    {
      dataField: 'id',
      text: 'Product ID',
    },
    {
      dataField: 'name',
      text: 'Product Name',
    },
    {
      dataField: 'price',
      text: 'Product Price',
    },
  ]
  const { SearchBar } = Search
  return (
    <ToolkitProvider keyField="id" data={products} columns={columns} search>
      {(props) => {
        return (
          <div>
            <SearchBar placeholder="search" {...props.searchProps} />
            <hr />
            <BootstrapTable {...props.baseProps} />
          </div>
        )
      }}
    </ToolkitProvider>
  )
}
export default Selling
