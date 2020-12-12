import { cx, css } from 'pretty-lights'
import InlineSVG from 'svg-inline-react'

const svgClass = css`
  display: block;
  margin: auto;
  align-self: center;
  transform: scale(0.1);
`

const SetIcon = ({ svg, cl, ...rest }) => {
  return (
    <InlineSVG src={svg} raw={true} className={cx(cl, svgClass)} {...rest} />
  )
}

export default SetIcon
