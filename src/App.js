import React, { Component } from 'react'
import './App.scss'
import Main from './lib/copy.sh-life/main'
import LifeCanvas from './LifeCanvas'
import {
  ExperimentalWithSmoothScroll,
  WorksWithSmoothScroll
} from './pages'

import {
  Router,
  Route,
  Link
} from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'


class App extends Component {

  constructor(props) {
    super(props)

    this.history = createHistory()
    this.state = {
      isRunning: false
    }
    // Listen for changes to the current location.
    const unlisten = this.history.listen((location, action) => {
      if(location.pathname !== '/') {
        // call stop
        this.main.userStop()
        this.setState({isRunning: false})
      }
    })
  }

  setIsRunning = (running) => {
    this.setState({isRunning: running})
  }

  componentDidMount = () => {
    this.main = new Main({setIsRunning: this.setIsRunning})
  }

  run = () => {
    const isRunning = this.main.userRun()
    this.setState({isRunning})
  }
  zoomIn = () => {
    this.main.userZoomIn()
  }
  zoomOut = () => {
    this.main.userZoomOut()
  }
  onMouseDown = (e) => {
    this.main.onMouseDown(e)
  }


  render() {
    return (
      <div className="App">

      <Router history={this.history}>
        <div>
          <div className='canvas-container'>
            <LifeCanvas run={this.run} isRunning={this.state.isRunning} zoomIn={this.zoomIn} zoomOut={this.zoomOut} onMouseDown={this.onMouseDown} />
            
            {/* Note:: add a recenter type of button!! */}
          </div>
          
          <Route exact path='/' />

          <Route path='/works' component={WorksWithSmoothScroll} />
          <Route path='/experimental' component={ExperimentalWithSmoothScroll} />


          <div className='Nav'>
            <ul>
              <li><Link to='/works'>Works</Link></li>
              <li><Link to='/experimental'>Experimental</Link></li>
              <li><a href='https://twitter.com/zlot'>Twitter</a></li>
              <li><a href='https://www.linkedin.com/in/mark-c-mitchell-96182311/'>LinkedIn</a></li>
              <li><a href='mailto:mark@markcmitchell.net'>mark@markcmitchell.net</a></li>
            </ul>
          </div>

        </div>
        
      </Router>





      </div>
    );
  }
}

export default App;
