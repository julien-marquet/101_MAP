import React, {Component} from 'react';
import {msToTime} from '../../helpers/date.helper'
import moment from 'moment'

class UpTime extends Component {
	constructor(props) {
		super(props);
		this.state = {
			time: null
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
		const date = moment.utc(nextProps.begin_at).subtract(1, 'hours');
		this.setState({
			time : moment.utc().diff(date)
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
		const d = moment.duration(this.state.time);
		return (
			<div className={'UpTime'}>
				<p>UpTime : {Math.floor(d.asHours()) + moment.utc(this.state.time).format(":mm:ss")}</p>
			</div>
		);
	}
}

export default UpTime;