import React from 'react'
import Header from '../components/Header.js'
import Nav from '../components/Nav.js'
import Body from '../components/Body.js'
import Login from '../components/Login.js'

const menu = [
  {
    link: '/',
    content: 'Home',
  },
  {
    link: '/selling',
    content: 'Selling',
  },
  {
    link: '/singles',
    content: 'Singles',
  },
  {
    link: '/about',
    content: 'About',
  },
]

const Home = () => {
  return (
    <div>
      <Header login={<Login />} />
      <Nav items={menu} />
      <Body />
    </div>
  )
}

export default Home
