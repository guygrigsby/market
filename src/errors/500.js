import React from 'react'
import { css } from 'pretty-lights'

const box = () => css`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`
const page = css`
  display: flex;
  margin-left: auto;
  flex-direction: column;
  width: 75%;
  margin: 2em;
  overflow-y: auto;
`
const codeClass = () => css`
  font-family: 'Monaco', monospace;
  color: #333;
  background-color: #eceaeb;
`
const InternalError = ({ err }) => {
  return (
    <div className={box}>
      <div className={page}>
        <h1>Oops...</h1>
        <h3>Something went wrong </h3>
        <p>
          If you have the time, please let use know what you were doing by
          sending an email to{' '}
          <a
            href={`mailto:bug@mtg.fail?subject=InternalError%Report&body=${err.stack}`}
          >
            bugs@mtg.fail.
          </a>
        </p>
        <p>
          (When you click the link, it will automatically include the error
          message in the email.)
        </p>
        <p style={{ fontWeight: 'bold' }}>{err.toLocaleString()}</p>
        <div className={codeClass}>{err.stack}}</div>
      </div>
    </div>
  )
}

export default InternalError
