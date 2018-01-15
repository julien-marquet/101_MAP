import React, {Component} from "react";
import PropTypes from "prop-types";

import placeholder from "../../../img/placeholder_profil.svg";

class Seat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSearched: false,
            isActive: false
        };
        this.addDefaultSrc = this.addDefaultSrc.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if ((this.props.user === undefined && nextProps.user !== undefined) ||
            (nextProps.user === undefined && this.props.user !== undefined)) {
            return true;
        }
        if (this.props.user !== undefined && nextProps.user !== undefined &&
            (this.props.user.user.login !== nextProps.user.user.login ||
            this.state.isSearched !== nextState.isSearched)) {
            return true;
        }
        if (this.props.activeUser.id !== nextProps.activeUser.id)
            return true;
        return false;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.searchedUser === "" && this.state.isSearched) {
            this.setState({isSearched: false});
        }
        else if (nextProps.user !== undefined &&
            nextProps.searchedUser !== "" &&
            ((nextProps.user.user.login.includes(nextProps.searchedUser.toLowerCase()) && !this.state.isSearched) ||
            (!nextProps.user.user.login.includes(nextProps.searchedUser.toLowerCase()) && this.state.isSearched))) {
            this.setState({isSearched: !this.state.isSearched});
        }
        if (nextProps.activeUser.id === 0 && this.state.isActive) {
            this.setState({isActive: false});
        }
        else if (nextProps.user !== undefined &&
            nextProps.activeUser.id !== 0 &&
            (nextProps.activeUser.id === nextProps.user.id)) {
            this.setState({isActive: !this.state.isActive});
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
                        className={this.state.isSearched || this.state.isActive ? "seatHover highlighted" : "seatHover"}
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
