import { cx, css } from 'pretty-lights'

const cellExpand = css`
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0;
  padding: 0;
  height: 100%;
  width: auto;
`
const ml1 = css`
  margin-left: 2px;
`
export const manaHeader = (str) => {
  return <span className={cellExpand}>{str}</span>
}
export const mana = (str) => {
  let symbols = []
  for (let i = 0; i < str.length; i++) {
    const curr = str[i]
    if (curr === '}') {
      //start
      const start = i
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
