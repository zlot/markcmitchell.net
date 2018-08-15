import React from 'react'

export default class Controls extends React.Component {

  componentDidMount = () => {
    this.el.addEventListener('touchmove', (e) => {
      e.preventDefault()
      return
    })
    this.el.addEventListener('wheel', this.props.onWheelScroll)
  }

  render() {
    const {run, runText, zoomIn, zoomOut} = this.props

    return (
      <div id="circle" ref={el => {this.el = el}}>
        <svg 
          version="1.1" 
          xmlns="http://www.w3.org/2000/svg" 
          xmlnsXlink="http://www.w3.org/1999/xlink" 
          x="0px" 
          y="0px" 
          viewBox="0 0 300 300" 
          enableBackground="new 0 0 300 300" 
          xmlSpace="preserve"
          overflow="hidden"
        >
          <defs>
              <path id="circlePath" d=" M 150, 150 m -60, 0 a 60,60 0 0,1 120,0 a 60,60 0 0,1 -120,0 "/>
          </defs>
          {/* <circle cx="150" cy="100" r="75" fill="none"/> */}
          <g>
            <use xlinkHref="#circlePath" fill="none"/>
            <text>
              <textPath xlinkHref="#circlePath">
                <a onMouseDown={(e) => {e.stopPropagation(); run()}}>{runText}</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <a onMouseDown={(e) => {e.stopPropagation(); zoomIn()}}>Zoom +</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <a onMouseDown={(e) => {e.stopPropagation(); zoomOut()}}>Zoom −</a>
              </textPath>
            </text>
          </g>
        </svg>
      </div>
    )
  }
}