import React, {Component} from "react";
import Toast from "./Toast";

class Toaster extends Component {
    renderToasts() {
        return (
            Object.keys(this.props.toaster.toasts).map((key) => {
                return (
                    <Toast key={key} id={key} toast={this.props.toaster.toasts[key]} hideToast={this.props.hideToast} />
                );
            })
        );
    }

    render(){ 
        return (
            <div className="toaster">
                {this.renderToasts()}
            </div>
        );
    }
}

export default Toaster;