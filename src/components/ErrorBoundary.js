import React from 'react'
import InternalError from '../errors/500.js'
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: false }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error }
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo)
  }

  render() {
    if (this.state.error) {
      // You can render any custom fallback UI
      return <InternalError err={this.state.error} />
    }

    return this.props.children
  }
}
export default ErrorBoundary
