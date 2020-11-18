import BootstrapTable from 'react-bootstrap-table-next'

const columns = [
  {
    dataField: 'name',
    text: 'Name',
  },
  {
    dataField: 'set',
    text: 'Set',
  },

  {
    dataField: 'prices.usd',
    text: 'Scryfall Price',
  },
]

const CardTable = (data) => {
  return <BootstrapTable keyField="id" data={data} columns={columns} />
}
export default CardTable
