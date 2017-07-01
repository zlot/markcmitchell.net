import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

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
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
      </div>
    );
  }
}

export default App;
