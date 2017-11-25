import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Warzone from '../containers/warzone';
import config from '../../config/globalConfig';
import logo from '../../img/101_logo.svg';
import '../css/App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      connected: false
    };

    this.connect = this.connect.bind(this);
  }

  connect() {
    const params = new URLSearchParams(window.location.search);
    this.props.socket.connect(params.get('code'))
    .then(() => {
      this.setState({connected: true});
    })
    .catch(() => {
      window.location.replace(`https://api.intra.42.fr/oauth/authorize?client_id=${config.clientId}&redirect_uri=${config.redirectUri}&response_type=code`);
    });
  }

  render() {
    if (this.state.connected)
      return (<Warzone />)
    return (
      <div className="wrapper">
        <h1>WarZone</h1>
        <img
          className={'logo'}
          src={logo}
        />
        <div
          className={'loginButton'}
          onClick={this.connect}
        >
          <p>{'Login'}</p>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  socket: PropTypes.object.isRequired
};

export default App;
