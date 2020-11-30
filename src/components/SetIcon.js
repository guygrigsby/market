import { css } from 'pretty-lights'
import InlineSVG from 'svg-inline-react'

const svgClass = css`
  display: block;
  margin: auto;
  align-self: center;
`

const SetIcon = ({ svg, ...rest }) => {
  return <InlineSVG src={svg} raw={true} className={svgClass} {...rest} />
}

export default SetIcon
