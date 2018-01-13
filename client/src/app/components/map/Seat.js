import React, {Component} from "react";
import PropTypes from "prop-types";

import placeholder from "../../../img/placeholder_profil.svg";

class Seat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isHighlighted: false
        };

        this.addDefaultSrc = this.addDefaultSrc.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if ((this.props.user === undefined && nextProps.user !== undefined) ||
            (nextProps.user === undefined && this.props.user !== undefined)) {
            return true;
        }
        if (this.props.user !== undefined &&
            nextProps.user !== undefined &&
            (this.props.user.user.login !== nextProps.user.user.login ||
            this.state.isHighlighted !== nextState.isHighlighted)) {
            return true;
        }
        return false;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.searchedUser === "" && this.state.isHighlighted) {
            this.setState({isHighlighted: false});
        }
        else if (nextProps.user !== undefined &&
            nextProps.searchedUser !== "" &&
            ((nextProps.user.user.login.includes(nextProps.searchedUser.toLowerCase()) && !this.state.isHighlighted) ||
            (!nextProps.user.user.login.includes(nextProps.searchedUser.toLowerCase()) && this.state.isHighlighted))) {
            this.setState({isHighlighted: !this.state.isHighlighted});
        }
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
                        className={this.state.isHighlighted ? "seatHover highlighted" : "seatHover"}
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
                            alt={"User"}
                        />
                    </div>
                </div>                    
            );
        }
    }
}

Seat.propTypes = {
    storeActiveUsers: PropTypes.func.isRequired,
    hostname: PropTypes.string,
    user: PropTypes.shape({
        login: PropTypes.string
    })
};

export default Seat;
