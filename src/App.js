import React, { Component } from 'react'
import './App.scss'
import Main from './lib/copy.sh-life/main'
import LifeCanvas from './LifeCanvas'
import {ExperimentalWithSmoothScroll} from './pages'
import {
  Router,
  Route,
  Link
} from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'

const Button = ({
  onClick,
  text
}) => (
  <button className='Button' onClick={onClick}>{text}</button>
)






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
  componentDidMount = () => {
    this.main = new Main()
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

  render() {
    return (
      <div className="App">

      <Router history={this.history}>
        <div>
          <LifeCanvas />
          <Route exact path='/'/>
          <Route path="/experimental" component={ExperimentalWithSmoothScroll}/>

          <div className='Button-container'>
            <Button onClick={this.run} text={this.state.isRunning ? 'Stop' : 'Run'} />
            <Button onClick={this.zoomIn} text={'Zoom +'} />
            <Button onClick={this.zoomOut} text={'Zoom -'} />
          </div>
          <div className='Nav'>
            <ul>
              <li><Link to='/'>Works</Link></li>
              <li><Link to='/experimental'>Experimental</Link></li>
              {/*<li><Link to='/'>Contact</Link></li>*/}
              <li><Link to='/'>Twitter</Link></li>
              <li><Link to='/'>LinkedIn</Link></li>
              <li><Link to='/'>Email</Link></li>
            </ul>
          </div>

        </div>
        
      </Router>





      </div>
    );
  }
}

export default App;
