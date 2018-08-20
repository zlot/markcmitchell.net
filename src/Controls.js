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
    const {run, runText, zoomIn, zoomOut, showOutOfBoundsControl, resetToInitialCanvasPos} = this.props

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
          
            {showOutOfBoundsControl &&
              <svg onClick={resetToInitialCanvasPos} className="return-to-centre"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 125" fill="white" width="70" x="117" y="10">
                <g>
                  <rect x="0" y="0" width="100" height="100" fill="transparent"/>
                  <path d="M45.625 56.094l-12.938 15.5h9.25v14.781h7.376V71.594h9.25l-12.938-15.5zM41.938 5.094v14.781h-9.25l12.937 15.531 12.938-15.531h-9.25V5.094h-7.376zM19.75 32.813v9.25H4.969v7.374H19.75v9.25L35.281 45.75 19.75 32.812zM71.469 32.813l-15.5 12.937 15.5 12.938v-9.25H86.25v-7.376H71.469v-9.25zM45.625 38.688c-3.89 0-7.063 3.173-7.063 7.062 0 3.89 3.174 7.031 7.063 7.031a7.024 7.024 0 0 0 7.031-7.031c0-3.89-3.142-7.063-7.031-7.063zm0 3c2.232 0 4.031 1.83 4.031 4.062a4.024 4.024 0 0 1-4.031 4.031c-2.232 0-4.063-1.799-4.063-4.031a4.077 4.077 0 0 1 4.063-4.063z"/>
                </g>
              </svg>
            }

          </g>
        </svg>
      </div>
    )
  }
}