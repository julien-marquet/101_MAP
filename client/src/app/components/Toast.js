import React, {Component} from "react";

class Toast extends Component {
    constructor() {
        super();
        this.renderButton = this.renderButton.bind(this);
    }

    componentDidMount() {
        if (typeof(this.props.toast.timeout) === "number")
        {
            setTimeout(() => {
                this.props.hideToast({id: this.props.id});
            }, this.props.toast.timeout);
        }
    }

    renderButton(){
        if (this.props.toast.action !== null) {
            return (
                <div className="toast-action-wrapper">
                    <button className="toast-action" onClick={this.props.toast.action}>
                        {this.props.toast.action_label}
                    </button>
                </div>
            );
        }
    }

    render() {
        return (
            <div className={`toast ${this.props.toast.type}`}>
                <div className="content">
                    {this.renderButton()}
                    <div className="message">
                        <p>
                            {this.props.toast.message}
                        </p>
                    </div>
                </div>
                <button className="dismiss-toast" onClick={() => {this.props.hideToast({id: this.props.id});}}>
                    X
                </button>
            </div>
        );
    }
}

export default Toast;