import React, {Component} from 'react';

class HostInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props.props
    };
    console.log(props.props);
  }

  renderHostInfo() {
    return (
      <div className={'data'}>
        <div className={'userInfo'}>
          <div className={'userPortrait'}>
          </div>
          <div className={'userName'}>
            {this.state.user.login}
          </div>
        </div>
        <div className={'hostName'}>
          {this.state.host}
        </div>
        <a className={'linkUserAccount'} href={"https://profile.intra.42.fr/users/" + this.state.user.login}>
          Profil
        </a>
      </div>
    );
  }
  
  render() {
    return (
      <div className={'hostInfoWrapper'}>
        {this.renderHostInfo()}
      </div>
    );
  }
}

export default HostInfo;
