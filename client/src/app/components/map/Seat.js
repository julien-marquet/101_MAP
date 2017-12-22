import React, {Component} from "react";

class Seat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            zoomed: false
        };

        this.addDefaultSrc = this.addDefaultSrc.bind(this);
    }
    addDefaultSrc(ev) {
        if(this.props.user !== undefined && ev.target.src.slice(-3) != "jpg")
            ev.target.src = `https://cdn.intra.42.fr/users/small_${this.props.user.user.login}.jpg`;
    }
    render() {
        if (this.props.user === undefined) {
            return (
                <div className={"seat"}>
                    <p>{this.props.hostname}</p>
                </div>
            );
        }
        else {
            return (
                <div
                    className={this.state.zoomed ? "seat" : null}
                    style={this.state.zoomed ? {position: "relative", overflow: "visible"} : null}
                >
                    <div
                        className={this.state.zoomed ? "seatHover" : "seat"}
                        onMouseOver={() => this.setState({zoomed: true})}
                        onClick={() => {
                            this.props.storeActiveUsers({
                                ...this.props.user,
                                hostname: this.props.hostname
                            });
                        }}
                        onMouseOut={() => this.setState({zoomed: false})}
                    >
                        <img
                            onError={this.addDefaultSrc}
                            src={`https://cdn.intra.42.fr/users/small_${this.props.user.user.login}.JPG`}
                            className={"userImg"}
                        />
                    </div>
                </div>                    
            );
        }
    }
}

export default Seat;
