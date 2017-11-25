import React, {Component} from 'react';
import logo from '../../img/logo.svg';
import '../css/App.css';

class App extends Component {
  componentWillMount() {
    if (this.props.redirection !== undefined) {
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
      <div className="wrapper">
        <h1>WarZone</h1>
      </div>
    );
  }
}

export default App;
