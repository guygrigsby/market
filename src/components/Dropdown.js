import React from 'react'
import { css } from 'pretty-lights'
import PropTypes from 'prop-types'

const closeClass = css`
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  &:hover,
  &:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
`

const modal = (top, left, width, height) => css`
  display: none;
  position: fixed; /* Stay in place */
  z-index: 999; /* Sit on top */
  top: ${top};
  left: ${left};
  width: ${width};
  height: ${height};
  background-color: white;
  padding: 10px;
  border: 1px solid #888;
  overflow: auto;
`

const outer = (vis = false) => css`
  display: ${vis ? 'block' : 'none'}
  height: 100%;
  width: 100;
`
const Inner = React.forwardRef(({ close, children, ...rest }, ref) => {
  const [top, setTop] = React.useState(0)
  const [left, setLeft] = React.useState(0)

  console.log('render modal')

  React.useEffect(() => {
    if (ref.current) {
      var viewportOffset = ref.current.getBoundingClientRect()
      setTop(viewportOffset.top)
      setLeft(viewportOffset.left)
    }
  }, [ref])
  return (
    <div className={modal(top, left, '40%', '20%')} {...rest}>
      {children}
      <span onClick={close} className={closeClass}>
        &times;
      </span>
    </div>
  )
})

const Modal = ({ children, ...rest }) => {
  const [visible, setVisible] = React.useState(false)
  const ref = React.createRef(null)

  const close = () => {
    setVisible(false)
  }
  console.log('modal', visible)
  return (
    <div className={outer(visible)} ref={ref} close={close}>
      <Inner ref={ref} />
    </div>
  )
}
Modal.propTypes = {
  open: PropTypes.func,
  children: PropTypes.element,
  ref: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
}
export default Modal
