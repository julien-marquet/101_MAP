import React, {Component} from "react";
import placeholder from "../../../img/placeholder_profil.svg";
import PropTypes from "prop-types";

class Seat extends Component {
    constructor(props) {
        super(props);
        this.addDefaultSrc = this.addDefaultSrc.bind(this);
    }

    addDefaultSrc(ev) {
        const ext = ev.target.src.slice(-3);
        if(this.props.user !== undefined && ext !== "jpg" && ext !== "svg")
            ev.target.src = `https://cdn.intra.42.fr/users/large_${this.props.user.user.login}.jpg`;
        else if (this.props.user !== undefined && ext === "jpg")
            ev.target.src = placeholder;
    }

    render() {
        if (this.props.user === undefined) {
            return (
                <div className={"seat"} />
            );
        }
        else {
            return (
                <div className={"seat"}>
                    <div
                        className={"seatHover"}
                        onClick={() => {
                            this.props.storeActiveUsers({
                                ...this.props.user,
                                hostname: this.props.hostname
                            });
                        }}
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

Seat.PropTypes = {
    storeActiveUsers: PropTypes.func.isRequired,
    hostname: PropTypes.string,
    user: {
        login: PropTypes.string
    }
};

export default Seat;
