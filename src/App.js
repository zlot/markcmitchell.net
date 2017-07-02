import React, { Component } from 'react'
import logo from './logo.svg'
import './App.scss'

import Main from './lib/copy.sh-life/main'
import LifeCanvas from './LifeCanvas'

const Button = ({
  onClick,
  text
}) => (
  <button className='Button' onClick={onClick}>{text}</button>
)

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isRunning: false
    }
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
        <LifeCanvas />
        <div className='Button-container'>
          <Button onClick={this.run} text={this.state.isRunning ? 'Stop' : 'Run'} />
          <Button onClick={this.zoomIn} text={'Zoom +'} />
          <Button onClick={this.zoomOut} text={'Zoom -'} />
        </div>
        <div className='Nav'>
          <ul>
            <li><a href='#'>Works</a></li>
            <li><a href='#'>Experimental</a></li>
            {/*<li><a href='#'>Contact</a></li>*/}
            <li><a href='#'>Twitter</a></li>
            <li><a href='#'>LinkedIn</a></li>
            <li><a href='#'>Email</a></li>
          </ul>
        </div>

      </div>
    );
  }
}

export default App;
