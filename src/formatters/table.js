import { cx, css } from 'pretty-lights'
import SetIcon from '../components/SetIcon'
import { useSets } from '../use-sets'

const cellExpand = css`
  height: 80%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`
const ml1 = css`
  margin-left: 2px;
`
const centerHeader = css`
  justify-content: center;
  align-items: center;
`
export const SetFormatter = ({ abrv, cl }) => {
  const sets = useSets()
  return <SetIcon svg={sets.get(abrv).logo} className={cl} />
}
export const header = (str, width) => (
  <span style={{ maxWidth: width }}>{str}</span>
)
export const setHeader = (str) => {
  return (
    <span key={`header-${str}`} className={cx(cellExpand, centerHeader)}>
      {str}
    </span>
  )
}
export const manaHeader = (str) => {
  return (
    <span key={`header-${str}`} className={cx(cellExpand, centerHeader)}>
      {str}
    </span>
  )
}
export const mana = (str) => {
  if (!str) return null
  let symbols = []
  for (let i = 0; i < str.length; i++) {
    const curr = str[i]
    if (curr === '}') {
      while (curr !== '}') {
        i++
      }
      const sym = str[i - 1]
      symbols.push(`ms ms-${sym} ms-cost`.toLowerCase())
    }
  }
  //
  return (
    <div className={cellExpand}>
      <span>
        {symbols.map((e, i) => (
          <i key={i} className={cx(e, ml1)}></i>
        ))}
      </span>
    </div>
  )
}

const genImageClass = (url) => {
  return css`
    background-image: url(${url});
    background-size: 100%;
    display: inline-block;
    height: 28px;
    width: 28px;
    vertical-align: middle;
    background-position: center;
  `
}
const imgWrapper = css`
  display: flex;
  justify-content: space-around;
`
export const img = (location) => {
  return (
    <div className={imgWrapper}>
      <div className={genImageClass(location)} />
    </div>
  )
}
