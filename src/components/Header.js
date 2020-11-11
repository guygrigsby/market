import React from 'react'
import { css } from 'pretty-lights'
import mtg from '../mtg_logo.png'

const style = css`
  padding: 25px;
`
const image = css`
  display: block;
  height: 25%;
`

const Header = () => {
  return (
    <div className={style}>
      <img className={image} src={mtg} alt="Magic: The Gathering" />
    </div>
  )
}

export default Header
