import React, {Component} from 'react';
import LogTime from './Logtime'

class HostInfo extends Component {
    constructor(props) {
        super(props);

        this.addDefaultSrc = this.addDefaultSrc.bind(this);
    }
    addDefaultSrc(ev) {
        if(this.props.activeUser !== undefined && ev.target.src.slice(-3) !== 'jpg')
		    ev.target.src = `https://cdn.intra.42.fr/users/medium_${this.props.activeUser.user.login}.jpg`
	}	
	render() {
		return (
				<div className={'hostInfoWrapper'}>
					<div className={'splitter'}>
						<div className={'leftCol'}>
							<img className={'userPortrait'} onError={this.addDefaultSrc} src={`https://cdn.intra.42.fr/users/medium_${this.props.activeUser.user.login}.JPG`}/>
						</div>
						<div className={'rightCol'}>
							<div className={'skewed'}>
							<div className={'hostName'}>
								<p>{this.props.activeUser.hostname}</p>
							</div>
							</div>
							<div className={'notskewed'} >
							<div className={'userName'}>
								<h2>{this.props.activeUser.user.login}</h2>
							</div>
							<LogTime begin_at={this.props.activeUser.begin_at} />
							<a className={'linkUserAccount'} href={"https://profile.intra.42.fr/users/" + this.props.activeUser.login}>
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
