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

  onButtonClick = () => {
    const isRunning = this.main.userRun()
    this.setState({isRunning})
  }

  render() {
    return (
      <div className="App">
        <LifeCanvas />
        <div className='Button-container'>
          <Button onClick={this.onButtonClick} text={this.state.isRunning ? 'Stop' : 'Run'} />
        </div>
        <div className='Nav'>
          <ul>
            <li>Works</li>
            <li>Experimental</li>
            <li>Twitter</li>
            <li>LinkedIn</li>
            <li>Email</li>
          </ul>
        </div>

      </div>
    );
  }
}

export default App;
