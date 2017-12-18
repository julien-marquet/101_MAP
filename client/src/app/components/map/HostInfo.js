import React, {Component} from 'react';
import LogTime from './Logtime'

class HostInfo extends Component {
	render() {
		const divStyle = {
			backgroundImage: `url('https://cdn.intra.42.fr/users/medium_${this.props.user.login}.JPG')`
		};
		return (
				<div className={'hostInfoWrapper'}>
					<div className={'splitter'}>
						<div className={'leftCol'}>
							<div className={'userPortrait'} style={divStyle} />
						</div>
						<div className={'rightCol'}>
							<div className={'skewed'}>
							<div className={'hostName'}>
								<p>{this.props.host}</p>
							</div>
							</div>
							<div className={'notskewed'} >
							<div className={'userName'}>
								<h2>{this.props.user.login}</h2>
							</div>
							<LogTime begin_at={this.props.begin_at} />
							<a className={'linkUserAccount'} href={"https://profile.intra.42.fr/users/" + this.props.user.login}>
								<span>Profil</span>
							</a>
							</div>
						</div>
					</div>
				</div>
		);
	}
}

export default HostInfo;
