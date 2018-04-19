import React, {Component} from "react";

class Toast extends Component {
    constructor() {
        super();

        this.state = {
            transition: "off"
        };

        this.transitionDuration = 600;
        this.renderButton = this.renderButton.bind(this);
        this.dismissToast = this.dismissToast.bind(this);
    }
    componentDidMount() {
        if (this.props.toast !== null) {
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
        if (this.props.toast.action !== null && this.props.toast.action !== undefined) {
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
    chooseIcons() {
        switch(this.props.toast.type) {
        case "info":
            return "fa-info";
        case "success":
            return "fa-check";
        case "warn":
            return "fa-exclamation-triangle";
        case "error":
            return "fa-exclamation-circle";
        default:
            return "fa-info";
        }
        
    }
    renderIcons() {
        if (!this.props.toast.action) {
            return (
                <i className={`icon-type fas ${this.chooseIcons()}`} />
            );
        }
    }

    render() {
        if (this.props.toast !== null) {
            return (
                <div className={`toast ${this.state.transition} ${this.props.toast.type}`}>
                    <div className="content">
                        {this.renderButton()}
                        <div className="message">
                            {this.renderIcons()}
                            <p>
                                {this.props.toast.message}
                            </p>
                        </div>
                    </div>
                    <button className="dismiss-toast" onClick={() => this.dismissToast()}>
                        <i className="fas fa-times" />
                    </button>
                </div>
            );
        }
        return null;
    }
}

export default Toast;