import React, {Component} from "react";
import PropTypes from "prop-types";

import globalConfig from "../../../config/globalConfig";
import placeholder from "../../../img/placeholder_profil.svg";

class Seat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSearched: false,
            isActive: false,
            hidden: true,
            imgSrc: 0
        };
        this.changeImgSrc = this.changeImgSrc.bind(this);
        this.getImgSrc = this.getImgSrc.bind(this);
        this.showImg = this.showImg.bind(this);
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
        if (nextState.imgSrc !== this.state.imgSrc || nextState.isSearched !== this.state.isSearched || nextState.isActive !== this.state.isActive || nextState.hidden !== this.state.hidden) {
            return true;
        }
        if (this.props.switchStatus !== nextProps.switchStatus) {
            return true;
        }
        return false;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.searchedUser.length < globalConfig.minimalSearchInput && this.state.isSearched) {
            this.setState({isSearched: false});
        }
        else if (nextProps.user !== undefined &&
            nextProps.searchedUser.length >= globalConfig.minimalSearchInput &&
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
            this.setState({isActive: true});
        } else {
            this.setState({isActive: false});
        }
    }

    getImgSrc() {
        if (this.props.user === undefined || this.state.imgSrc > 1)
            return placeholder;
        else if (this.state.imgSrc === 0)
            return (`https://cdn.intra.42.fr/users/small_${this.props.user.user.login}.JPG`);
        else
            return (`https://cdn.intra.42.fr/users/small_${this.props.user.user.login}.jpg`);
    }
    changeImgSrc() {
        this.setState({
            imgSrc: this.state.imgSrc + 1
        });
    }

    showImg() {
        this.setState({
            hidden: false
        });
    }

    getSwitchStatusStyle() {
        return ((this.props.switchStatus === 0 && this.props.user.pool) || (this.props.switchStatus === 2 && !this.props.user.pool) ? {opacity: 0.2} : {});
    }

    render() {
        if (this.props.user === undefined) {
            return (
                <div className={"seat"} />
            );
        }
        else {
            let className = this.state.isSearched;
            if (className === null || className === undefined || !className) {
                className = "seatHover";
                if (this.props.user.pool) {
                    className += " newbie";
                }
                if (this.state.isActive) {
                    className += " highlighted";
                }
            }
            return (
                <div className={"seat taken"}>
                    <div
                        className={className}
                        onClick={() => {
                            if (this.props.mode === "passive") {
                                this.props.quitPassiveMode();
                                localStorage.removeItem("mode");
                            }
                            this.props.storeActiveUsers({
                                ...this.props.user,
                                hostname: this.props.hostname
                            });
                        }}
                    >
                        {!this.state.hidden &&  <div />}
                        <img
                            onError={this.changeImgSrc}
                            onLoad={() => this.setState({hidden: false})}
                            src={this.getImgSrc()}
                            className={`userImg ${this.state.hidden ? "hiddenImg" : ""}`}
                            style={this.getSwitchStatusStyle()}
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
    }),
    searchedUser: PropTypes.string,
    switchStatus: PropTypes.number.isRequired
};

export default Seat;
