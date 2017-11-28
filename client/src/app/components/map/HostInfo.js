import React, {Component} from 'react';

class LogTime extends Component {
	constructor(props) {
		super(props);
		this.state = {
			time: new Date(),
			start: new Date(this.props.begin_at)
		}
	}
	
	componentDidMount() {
		this.intervalID = setInterval(
			() => this.tick(),
			1000
		);
	}
	componentWillUnmount() {
		clearInterval(this.intervalID);
	}
	
	tick() {
		this.setState({
			time: new Date()
		});
	}
	render()
	{
		return (
			<div className={'logTime'}>
				LogTime : {msToTime(this.state.time - this.state.start)}
			</div>
		);
	}
}

class HostInfo extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			...props.props
		}
	}
	
	renderHostInfo() {
		return (
			<div className={'data'}>
				<div className={'splitter'}>
					<div className={'leftCol'}>
						<div className={'userPortrait'}>
							<img alt={'portrait_' + this.state.user.login} src={'https://cdn.intra.42.fr/users/medium_'+ this.state.user.login + '.JPG'} />
						</div>
						<div className={'hostName'}>
							{this.state.host}
						</div>
					</div>
					<div className={'rightCol'}>
						<div className={'userName'}>
							{this.state.user.login}
						</div>
					<LogTime begin_at={this.state.begin_at} />
					</div>
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

function msToTime(duration) {
	let	seconds = parseInt((duration/1000)%60, 10),
				minutes = parseInt((duration/(1000*60))%60, 10),
				hours = parseInt((duration/(1000*60*60))%24, 10);
	
	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;
	
	return hours + ":" + minutes + ":" + seconds;
}

export default HostInfo;
