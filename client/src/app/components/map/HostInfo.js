import React, {Component} from 'react';
import LogTime from './Logtime'

class HostInfo extends Component {
	
	render() {
		return (
			<div className={'hostInfoWrapper'}>
				<div className={'data'}>
					<div className={'splitter'}>
						<div className={'leftCol'}>
							<div className={'userPortrait'}>
								<img alt={'portrait_' + this.props.user.login} src={'https://cdn.intra.42.fr/users/medium_'+ this.props.user.login + '.JPG'} />
							</div>
							<div className={'hostName'}>
								<p>{this.props.host}</p>
							</div>
						</div>
						<div className={'rightCol'}>
							<div className={'userName'}>
								<p>{this.props.user.login}</p>
							</div>
							<LogTime begin_at={this.props.begin_at} />
						</div>
					</div>
					<a className={'linkUserAccount'} href={"https://profile.intra.42.fr/users/" + this.props.user.login}>
						<p>Profil</p>
					</a>
				</div>
			</div>
		);
	}
}

export default HostInfo;
