import React from 'react'
import { useAuthUI } from '../use-auth.js'

const LoginPage = () => {
  useAuthUI('#firebaseui')
  return <div id="firebaseui"></div>
}

export default LoginPage
