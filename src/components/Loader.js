import React from 'react'
import { css } from 'pretty-lights'
const spin = css`
  display: block;
  width: 50%;
  height: 50%;
  margin: auto;
  width: 50%;
  border: 16px solid lightgray;
  border-top: 16px solid #333;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const Loader = () => <div className={spin} />

export default Loader
