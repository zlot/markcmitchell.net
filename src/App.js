import React, { Component } from 'react'
import logo from './logo.svg'
import './App.scss'

import Main from './lib/copy.sh-life/main'
import LifeCanvas from './LifeCanvas'

class App extends Component {

  componentDidMount = () => {
    this.main = new Main()
  }

  render() {
    return (
      <div className="App">
        <LifeCanvas />
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
