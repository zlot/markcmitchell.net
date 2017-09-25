import React, {Component} from 'react'
import smoothScroll from 'smoothscroll'

export default function withSmoothScroll(WrappedComponent, componentName) {
  return class extends Component {
    componentDidMount = () => {
      smoothScroll(this.el, 1500)
    }
    render = () => (
      <div className={`page ${componentName}`} ref={(el => {this.el = el})}>
        <WrappedComponent />
      </div>
    )
  }
}