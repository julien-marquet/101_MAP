import React, {Component} from 'react';
import {msToTime} from '../../helpers/date.helper'

class LogTime extends Component {
	constructor(props) {
		super(props);
		this.state = {
			time: (new Date() - new Date(this.props.begin_at))
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
			time: (this.state.time + 1000)
		});
	}
	
	render()
	{
		return (
			<div className={'logTime'}>
				<p>LogTime : {msToTime(this.state.time)}</p>
			</div>
		);
	}
}

export default LogTime;