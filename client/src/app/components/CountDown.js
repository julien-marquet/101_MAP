import React, {Component} from "react";

class CountDown extends Component {

    constructor(props) {
        super(props);
        this.clock = null;
        this.state = {
            countDown: this.initiateCountDown(this.props.countDown)
        };
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    initiateCountDown(countDown) {
        clearInterval(this.clock);
        this.clock = setInterval(() => {
            if (!this.mounted || countDown < 0) 
                clearInterval(this.clock);
            else if (this.state.countDown)
                this.setState({
                    countDown: this.state.countDown - 1000 >= 0 ? this.state.countDown - 1000 : 0
                });
        }, 1000);
        return countDown + 500 - Date.now();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.CountDown !== this.props.CountDown || nextState.countDown !== this.state.countDown)
            return true;
        return false;
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            countDown: this.initiateCountDown(nextProps.countDown)
        });
    }

    render()
    {
        const hours = Math.floor((this.state.countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((this.state.countDown % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((this.state.countDown % (1000 * 60)) / 1000);

        return (
            <div className={"countDown"}>
                <p>{`${hours > 0 ? `${hours}h` : ""} ${minutes > 0 ? `${minutes}m` : ""} ${seconds}s`}</p>
            </div>
        );
    }
}

export default CountDown;