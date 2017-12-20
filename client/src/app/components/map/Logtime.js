import React, {Component} from 'react';
import {msToTime} from '../../helpers/date.helper'
import Moment from 'moment'

class LogTime extends Component {
	constructor(props) {
		super(props);
		this.state = {
			time: Moment().diff(this.props.begin_at)
		}
		this.timeout = null;
	}
	componentDidMount() {
		this.setTimer();
	}
	componentDidUpdate() {
		this.setTimer();
	}
	componentWillReceiveProps(nextProps) {
		clearTimeout(this.timeout);
		console.log(nextProps.begin_at);
		this.setState({
			time : Moment().diff(nextProps.begin_at)
		})
	}
	tick() {
		this.setState({
			time: (this.state.time + 1000)
		});
	}
	setTimer() {
		this.timeout = setTimeout(() => {
			this.tick();
		}, 1000);
	}
	render()
	{
		return (
			<div className={'logTime'}>
				<p>LogTime : {Moment(this.state.time).format("hh:mm:ss")}</p>
			</div>
		);
	}
}

export default LogTime;