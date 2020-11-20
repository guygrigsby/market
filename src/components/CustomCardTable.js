import React from 'react'
import { css } from 'pretty-lights'

const base = css`
  width: 100%;
  padding: 20px 0 20px 0;
`

const body = css`
  background-color: lightGrey;
`

const rows = css`
  width: 100%;
`

const CustomCardTable = ({ cards, columns, ...rest }) => {
  return (
    <table className={base} {...rest}>
      <thead className={base}>
        <tr className={base}>
          {columns.map((e, i) => (
            <th key={i}>{e.text}</th>
          ))}
        </tr>
      </thead>
      <tbody className={body}>
        {cards &&
          cards.map((row, rowIdx) => {
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
