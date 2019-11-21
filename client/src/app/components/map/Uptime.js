import React, {Component} from "react";
import moment from "moment";
import PropTypes from "prop-types";

class UpTime extends Component {
    constructor(props) {
        super(props);

        this.timeout = null;
        const date = moment.utc(props.begin_at);
        this.state = {
            time : moment.utc().diff(date)
        };
        this.setTimer();
    }

    componentWillReceiveProps(nextProps) {

        if (this.timeout !== null) {
            clearTimeout(this.timeout);
        }
        const date = moment.utc(nextProps.begin_at);
        this.setState({
            time : moment.utc().diff(date)
        });
        this.setTimer();
    }

    componentWillUnmount() {
        if (this.timeout !== null) {
            clearTimeout(this.timeout);
        }
    }

    tick() {
        this.setState({
            time: (this.state.time + 1000)
        });
        this.setTimer();
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
            <li className={"stat stat-1 uptime"}>
                <p>
                    <span className={"statName"}>
                        UpTime :
                    </span>
                    <span className={"statValue"}>
                        {this.state.time === null ? "00:00:00" : Math.floor(d.asHours()) + moment.utc(this.state.time).format(":mm:ss")}
                    </span>    
                </p>
            </li>
        );
    }
}

UpTime.propTypes = {
    begin_at: PropTypes.string.isRequired
};

export default UpTime;