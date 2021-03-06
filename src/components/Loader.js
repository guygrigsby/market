import React from 'react'
import { css } from 'pretty-lights'
const spin = css`
  display: block;
  border-top: 8px solid #333;
  border-radius: 200px;
  width: 100px;
  height: 100px;
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
