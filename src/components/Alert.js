import React from 'react'
import { cx, css } from 'pretty-lights'
import '../index.css'

const errorClass = css`
  display: flex;
  position: relative;
  justify-content: flex-end;
`

const fade = css`
  animation: fadeOut ease 3s;
  -webkit-animation: fadeOut ease 3s;
  -moz-animation: fadeOut ease 3s;
  -o-animation: fadeOut ease 3s;
  -ms-animation: fadeOut ease 3s;
  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @-moz-keyframes fadeOut {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @-webkit-keyframes fadeOut {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @-o-keyframes fadeOut {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @-ms-keyframes fadeOut {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`

const inner = css`
  position: absolute;
  width: 30%;
  border-radius: 5px;
  margin: 2em;
  padding: 2em;
  background-color: #f2f2f2;
  box-shadow: 5px 5px 15px 0 #333;
`

const content = css`
  flex: 0;
`
const close = css`
  position: absolute;
  right: 0;
  top: 0;
  padding: 0.5em;
  border-radius: 100px;
  align-self: flex-end;
  background-color: #f2f2f2;
  color: #333#;
  &:hover {
    cursor: pointer;
  }
`
const title = css`
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 1em;
`

const head = css`
  position: absolute;
  right: 0.5em;
  top: 0.25em;
`

const Alert = ({ msg, onClose, timer }) => {
  const handleEscape = (event) => {
    if (event.keyCode === 27) {
      onClose()
    }
  }

  React.useEffect(() => {
    document.addEventListener('keydown', handleEscape, false)

    return () => {
      document.removeEventListener('keydown', handleEscape, false)
    }
  })

  setTimeout(onClose, 6000)

  return (
    <div className={errorClass} onClick={onClose}>
      <div className={cx(inner, fade)}>
        <div className={head}>
          <div onClick={onClose} className={cx(close, 'button-like')}>
            &times;
          </div>
        </div>
        <div className={title}>A Error Occured</div>
        <div className={content}>{msg}</div>
      </div>
    </div>
  )
}

export default Alert
