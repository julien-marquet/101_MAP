import React, {Component} from 'react';
import logo from '../../img/logo.svg';
import '../css/App.css';

class App extends Component {
  componentWillMount() {
    if (this.props.redirection !== undefined) {
      console.log('Redirection: ', this.props.redirection);
      setTimeout(() => {
        window.location.replace(this.props.redirection);
      }, 2000);
    }
    // this.props.socket.emit('');
  }

  render() {
    if (this.props.redirection !== undefined)
      return null;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
