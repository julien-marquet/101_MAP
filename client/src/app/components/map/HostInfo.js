import React, {Component} from 'react';
import LogTime from './Logtime'

class HostInfo extends Component {
	constructor(props) {
        super(props);

        this.addDefaultSrc = this.addDefaultSrc.bind(this);
    }
    addDefaultSrc(ev) {
        if(this.props.user !== undefined && ev.target.src != `https://cdn.intra.42.fr/users/small_${this.props.user.user.login}.jpg`)
		    ev.target.src = `https://cdn.intra.42.fr/users/small_${this.props.user.user.login}.jpg`
	}	
	render() {
		const divStyle = {
			backgroundImage: `url('https://cdn.intra.42.fr/users/medium_${this.props.user.login}.JPG')`
		};
		return (
				<div className={'hostInfoWrapper'}>
					<div className={'splitter'}>
						<div className={'leftCol'}>
							<div className={'userPortrait'} style={divStyle} onError={this.addDefaultSrc}/>
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
