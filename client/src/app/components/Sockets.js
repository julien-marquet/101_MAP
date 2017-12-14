import React, {Component} from 'react';
import PropTypes from 'prop-types';

import config from '../../config/globalConfig';
import '../css/App.css';

class Sockets extends Component {
  constructor(props) {
    super(props);

    this.state = {
      connected: false
    };
  }

  componentWillMount() {
    this.props.socket.on("connectedUsers", data => {
        this.props.storeUsers(data);
    });
  }

  render() {
      return (<div />);
  }
}

Sockets.propTypes = {
  socket: PropTypes.object.isRequired
};

export default Sockets;