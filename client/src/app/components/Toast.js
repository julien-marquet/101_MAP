import React, {Component} from "react";

class Toast extends Component {
    constructor() {
        super();
        this.renderButton = this.renderButton.bind(this);
        this.dismissToast = this.dismissToast.bind(this);
        this.transitionDuration = 600;
        
        this.state = {
            transition: "off"
        };
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                transition: "on"
            });
        }, 100);
        if (typeof(this.props.toast.timeout) === "number")
            setTimeout(() => {
                this.dismissToast();
            }, this.props.toast.timeout);
    }

    dismissToast() {
        this.setState({
            transition: "off"
        });
        setTimeout(() => {
            this.props.hideToast({id: this.props.id});
        }, this.transitionDuration);
    }

    renderButton(){
        if (this.props.toast.action !== null) {
            return (
                <div className="toast-action-wrapper">
                    <button className="toast-action" onClick={() => {
                        this.props.toast.action.func();
                        this.dismissToast();
                    }}>
                        {this.props.toast.action.label}
                    </button>
                </div>
            );
        }
    }

    render() {
        return (
            <div className={`toast ${this.state.transition} ${this.props.toast.type}`}>
                <div className="content">
                    {this.renderButton()}
                    <div className="message">
                        <p>
                            {this.props.toast.message}
                        </p>
                    </div>
                </div>
                <button className="dismiss-toast" onClick={() => this.dismissToast()}>
                    X
                </button>
            </div>
        );
    }
}

export default Toast;