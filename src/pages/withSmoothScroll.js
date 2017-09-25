import React from 'react'
import smoothScroll from 'smoothscroll'

export default function withSmoothScroll(WrappedComponent, componentName) {
  
  const SCROLL_SPEED = 1500

  return class extends React.Component {
    componentDidMount = () => {
      smoothScroll(this.el, SCROLL_SPEED)
    }
    render = () => (
      <div className={`page ${componentName}`} ref={(el => {this.el = el})}>
        <WrappedComponent />
      </div>
    )
  }
}