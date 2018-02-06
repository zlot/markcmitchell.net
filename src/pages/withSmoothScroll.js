import React from 'react'
import smoothScroll from 'smoothscroll'

export default function withSmoothScroll(WrappedComponent, componentName) {
  
  const SCROLL_SPEED = 1150

  return class WithSmoothScrollCompositor extends React.Component {
    componentDidMount = () => {
      // Will scroll to position on mount
      smoothScroll(this.el, SCROLL_SPEED)  
    }

    render = () => (
      <div className={`page ${componentName}`} ref={(el => {this.el = el})}>
        <WrappedComponent />
      </div>
    )
  }
}