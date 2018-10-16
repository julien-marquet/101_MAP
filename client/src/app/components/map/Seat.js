import React, {Component} from "react";
import PropTypes from "prop-types";
import Lottie from "react-lottie";

import * as bomb from "./bomb.json";
import * as explosion from "./explosion.json";
import * as flames from "./flames.json";
import * as flamesEnd from "./flamesEnd.json";
import globalConfig from "../../../config/globalConfig";
import placeholder from "../../../img/placeholder_profil.svg";

class Seat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSearched: false,
            isActive: false,
            hidden: true,
            imgSrc: 0,
            hideUser: false
        };
        this.changeImgSrc = this.changeImgSrc.bind(this);
        this.getImgSrc = this.getImgSrc.bind(this);
        this.showImg = this.showImg.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.mode !== nextProps.mode) {
            return true;
        }
        if (this.props.mode === "game") {
            if (this.state.hideUser !== nextState.hideUser ||
                this.props.user !== nextProps.user ||
                (this.props.user !== undefined && nextProps.user !== undefined && this.props.user.user !== nextProps.user.user) ||
                (this.props.user !== undefined && nextProps.user !== undefined &&
                this.props.user.user !== undefined && nextProps.user.user !== undefined &&
                this.props.user.user.id !== nextProps.user.user.id)) {
                return true;
            } if (Array.isArray(this.props.user) && !Array.isArray(nextProps.user)) {
                return false;
            }
            return false;
        }
        if ((this.props.user === undefined && nextProps.user !== undefined) ||
            (nextProps.user === undefined && this.props.user !== undefined)) {
            return true;
        }
        if (this.props.user !== undefined && nextProps.user !== undefined &&
            (this.props.user.type !== "bomb" &&
            (this.props.user.user.login !== nextProps.user.user.login ||
            this.props.user.type !== nextProps.user.type) ||
                this.state.isSearched !== nextState.isSearched)) {
            return true;
        }
        if (nextState.imgSrc !== this.state.imgSrc || nextState.isSearched !== this.state.isSearched || nextState.isActive !== this.state.isActive || nextState.hidden !== this.state.hidden) {
            return true;
        }
        if (this.props.switchStatus !== nextProps.switchStatus) {
            return true;
        }
        if (this.props.currentUser.id === undefined && nextProps.currentUser.id !== undefined) {
            return true;
        }
        return false;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.mode !== "game") {
            if (nextProps.searchedUser.length < globalConfig.minimalSearchInput && this.state.isSearched) {
                this.setState({isSearched: false});
            }
            else if (nextProps.user !== undefined && nextProps.user.type !== "bomb" &&
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
        } else {
            if (this.props.mode !== "game") {
                this.setState({hidden: false});
            }
            const user = Array.isArray(nextProps.user) ? nextProps.user.filter(u => u !== undefined && u.type === "player")[0] : nextProps.user;
            if (user !== undefined && Object.keys(user).length === 0) {
                this.props.playerDead();
            } if (Array.isArray(this.props.user) && !Array.isArray(nextProps.user)) {
                this.setState({hideUser: true});
            } if (this.state.hideUser &&
                nextProps.user === undefined) {
                this.setState({hideUser: false});
            }
        }
    }

    getImgSrc(user) {
        if (user === undefined || this.state.imgSrc > 1)
            return placeholder;
        else if (this.state.imgSrc === 0)
            return (`https://cdn.intra.42.fr/users/small_${user.user.login}.JPG`);
        else
            return (`https://cdn.intra.42.fr/users/small_${user.user.login}.jpg`);
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

    getSwitchStatusStyle(user) {
        return ((this.props.switchStatus === 0 && user.pool) || (this.props.switchStatus === 2 && !user.pool) ? {opacity: 0.2} : {});
    }

    bombExplode() {
        const z = parseInt(this.props.hostname.split("z")[1].split("r")[0], 10);
        const r = parseInt(this.props.hostname.split("r")[1].split("p")[0], 10);
        const p = parseInt(this.props.hostname.split("p")[1], 10);
        const entities = {
            // [this.props.hostname]: {type: "explosion"},
            [`z${z}r${r}p${p + 1}`]: {type: "flames", direction: "right"},
            [`z${z}r${r}p${p - 1}`]: {type: "flames", direction: "left"},
            [`z${z}r${r - 1}p${p}`]: {type: "flames", direction: "up"},
            [`z${z}r${r + 1}p${p}`]: {type: "flames", direction: "down"}
        };
        const touched = {left: false, right: false, up: false, down: false};
        if (this.props.allUsers[`z${z}r${r}p${p + 1}`] !== undefined) {
            if (Array.isArray(this.props.allUsers[`z${z}r${r}p${p + 1}`]) ||
                (this.props.allUsers[`z${z}r${r}p${p + 1}`].type !== undefined &&
                !this.props.allUsers[`z${z}r${r}p${p + 1}`].type.includes("flames"))) {
                touched.right = true;
            }
        } if (this.props.allUsers[`z${z}r${r}p${p  - 1}`] !== undefined) {
            if (Array.isArray(this.props.allUsers[`z${z}r${r}p${p - 1}`]) ||
            (this.props.allUsers[`z${z}r${r}p${p - 1}`].type !== undefined &&
            !this.props.allUsers[`z${z}r${r}p${p - 1}`].type.includes("flames"))) {
                touched.left = true;
            }
        } if (this.props.allUsers[`z${z}r${r - 1}p${p}`] !== undefined) {
            if (Array.isArray(this.props.allUsers[`z${z}r${r - 1}p${p}`]) ||
            (this.props.allUsers[`z${z}r${r - 1}p${p}`].type !== undefined &&
            !this.props.allUsers[`z${z}r${r - 1}p${p}`].type.includes("flames"))) {
                touched.up = true;
            }
        } if (this.props.allUsers[`z${z}r${r + 1}p${p}`] !== undefined) {
            if (Array.isArray(this.props.allUsers[`z${z}r${r + 1}p${p}`]) ||
            (this.props.allUsers[`z${z}r${r + 1}p${p}`].type !== undefined &&
            !this.props.allUsers[`z${z}r${r + 1}p${p}`].type.includes("flames"))) {
                touched.down = true;
            }
        }
        if (!touched.right &&
            globalConfig.mapPositions[`z${z}`][r - 1] !== undefined &&
            globalConfig.mapPositions[`z${z}`][r - 1][p + 1] !== undefined) {
            if (this.props.allUsers[`z${z}r${r}p${p + 2}`] === undefined ||
                Array.isArray(this.props.allUsers[`z${z}r${r}p${p + 2}`]) ||
                !this.props.allUsers[`z${z}r${r}p${p + 2}`].type.includes("flames")) {
                entities[`z${z}r${r}p${p + 2}`] = {type: "flamesEnd", direction: "right"};
            }
        } if (!touched.left &&
            globalConfig.mapPositions[`z${z}`][r - 1] !== undefined &&
            globalConfig.mapPositions[`z${z}`][r - 1][p - 3] !== undefined) {
            if (this.props.allUsers[`z${z}r${r}p${p - 2}`] === undefined ||
                Array.isArray(this.props.allUsers[`z${z}r${r}p${p - 2}`]) ||
                !this.props.allUsers[`z${z}r${r}p${p - 2}`].type.includes("flames")) {
                entities[`z${z}r${r}p${p - 2}`] = {type: "flamesEnd", direction: "left"};
            }
        } if (!touched.up &&
            globalConfig.mapPositions[`z${z}`][r - 3] !== undefined &&
            globalConfig.mapPositions[`z${z}`][r - 3][p - 1] !== undefined) {
            if (this.props.allUsers[`z${z}r${r - 2}p${p}`] === undefined ||
                Array.isArray(this.props.allUsers[`z${z}r${r - 2}p${p}`]) ||
                !this.props.allUsers[`z${z}r${r - 2}p${p}`].type.includes("flames")) {
                entities[`z${z}r${r - 2}p${p}`] = {type: "flamesEnd", direction: "up"};
            }
        } if (!touched.down &&
            globalConfig.mapPositions[`z${z}`][r + 1] !== undefined &&
            globalConfig.mapPositions[`z${z}`][r + 1][p - 1] !== undefined) {
            if (this.props.allUsers[`z${z}r${r + 2}p${p}`] === undefined ||
                Array.isArray(this.props.allUsers[`z${z}r${r + 2}p${p}`]) ||
                !this.props.allUsers[`z${z}r${r + 2}p${p}`].type.includes("flames")) {
                entities[`z${z}r${r + 2}p${p}`] = {type: "flamesEnd", direction: "down"};
            }
        }
        this.props.bombExplode({entities, pos: this.props.hostname});
        Object.keys(entities).map(key => entities[key] = undefined);
        setTimeout(() => this.props.destroy(entities), 1000);
    }

    renderBomb() {
        return (
            <Lottie
                options={{
                    animationData: bomb,
                    loop: false,
                    autoplay: true,
                    rendererSettings: {
                        preserveAspectRatio: "xMidYMid slice"
                    }
                }}
                width={"450%"}
                height={"450%"}
                isStopped={false}
                isPaused={false}
                eventListeners={[{
                    eventName: "complete",
                    callback: () => this.bombExplode()
                }]}
            />
        );
    }

    getExtraStyle(user) {
        const style = {};
        if (user !== undefined && user.direction !== undefined) {
            const z = parseInt(this.props.hostname.split("z")[1].split("r")[0], 10);
            const r = parseInt(this.props.hostname.split("r")[1].split("p")[0], 10);
            if (z === 1) {
                if ((r >= 6 && r <= 14)) {
                    if (user.direction === "right") {
                        style.transform = "rotateZ(180deg)";
                    } else if (user.direction === "down") {
                        style.transform = "rotateZ(-90deg)";
                    } else if (user.direction === "up") {
                        style.transform = "rotateZ(90deg)";
                    }
                } else {
                    if (user.direction === "left") {
                        style.transform = "rotateZ(180deg)";
                    } else if (user.direction === "down") {
                        style.transform = "rotateZ(90deg)";
                    } else if (user.direction === "up") {
                        style.transform = "rotateZ(-90deg)";
                    }
                }
            } else if (z === 2) {
                if (user.direction === "right") {
                    style.transform = "rotateZ(180deg)";
                } else if (user.direction === "down") {
                    style.transform = "rotateZ(90deg)";
                } else if (user.direction === "up") {
                    style.transform = "rotateZ(-90deg)";
                }
            } else if (z === 3) {
                if (user.direction === "right") {
                    style.transform = "rotateZ(-90deg)";
                } else if (user.direction === "up") {
                    style.transform = "rotateZ(180deg)";
                } else if (user.direction === "left") {
                    style.transform = "rotateZ(90deg)";
                }
            } else if (z === 4) {
                if (user.direction === "down") {
                    style.transform = "rotateZ(90deg)";
                } else if (user.direction === "up") {
                    style.transform = "rotateZ(-90deg)";
                } else if (user.direction === "left") {
                    style.transform = "rotateZ(180deg)";
                }
            }
        }
        return style;
    }

    render() {
        const isArray = Array.isArray(this.props.user);
        const user = Array.isArray(this.props.user) ? this.props.user.filter(u => u !== undefined && u.type === "player")[0] : this.props.user;
        const extraStyle =  this.getExtraStyle(user);
        if (!this.state.hideUser && (user === undefined || Object.keys(user).length === 0 ||
            user.type === "explosion" || (user.type === "player" && user.user === undefined))) {
            return (
                <div className={this.props.isTp ? "seat teleporter" : "seat"}>
                    <p style={{fontSize: "0.6em"}}>{this.props.hostname}</p>
                </div>
            );
        } else if (!this.state.hideUser && user.type ===  "bomb") {
            return (
                <div className={"seat bomb"}>
                    {this.renderBomb()}
                </div>
            );
        } else if (!this.state.hideUser && user.type === "flames") {
            return (
                <div className={"seat flames"} style={extraStyle}>
                    <Lottie
                        options={{
                            animationData: flames,
                            loop: false,
                            autoplay: true,
                            rendererSettings: {
                                preserveAspectRatio: "xMidYMid slice"
                            }
                        }}
                        width={"138%"}
                        height={"138%"}
                        isStopped={false}
                        isPaused={false}
                    />
                </div>
            );
        } else if (!this.state.hideUser && user.type === "flamesEnd") {
            return (
                <div className={"seat flames"} style={extraStyle}>
                    <Lottie
                        options={{
                            animationData: flamesEnd,
                            loop: false,
                            autoplay: true,
                            rendererSettings: {
                                preserveAspectRatio: "xMidYMid slice"
                            }
                        }}
                        width={"138%"}
                        height={"138%"}
                        isStopped={false}
                        isPaused={false}
                    />
                </div>
            );
        } else {
            let className = "seatHover";
            if (this.state.isSearched || this.state.isActive) {
                className += " highlighted";
            }
            if (!this.state.hideUser && user.pool) {
                className += " newbie";
            }
            if (!this.state.hideUser &&
                this.props.currentUser.id !== undefined &&
                this.props.currentUser.id !== user.user.id &&
                user.type === "wall") {
                className += " grayscale";
            }
            let wrapperClassname = "seat";
            if (this.state.hideUser) {
                wrapperClassname += " bomb";
            } else {
                wrapperClassname += " taken";
                if (isArray) {
                    wrapperClassname += " bomb";
                }
            }
            return (
                <div className={wrapperClassname}>
                    {!this.state.hideUser &&
                        <div
                            className={className}
                            onClick={() => {
                                if (this.props.mode === "passive") {
                                    this.props.quitPassiveMode();
                                    localStorage.removeItem("mode");
                                }
                                this.props.storeActiveUsers({
                                    ...user,
                                    hostname: this.props.hostname
                                });
                            }}
                        >
                            {!this.state.hidden &&  <div />}
                            <img
                                onError={this.changeImgSrc}
                                onLoad={() => this.setState({hidden: false})}
                                src={this.getImgSrc(user)}
                                className={`userImg ${this.state.hidden ? "hiddenImg" : ""}`}
                                style={this.getSwitchStatusStyle(user)}
                            />
                        </div>
                    }
                    {(isArray || this.state.hideUser) && this.renderBomb()}
                </div>                
            );
        }
    }
}

Seat.propTypes = {
    storeActiveUsers: PropTypes.func.isRequired,
    hostname: PropTypes.string,
    user: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    searchedUser: PropTypes.string,
    switchStatus: PropTypes.number.isRequired,
    currentUser: PropTypes.object.isRequired,
    mode: PropTypes.string.isRequired,
    bombExplode: PropTypes.func.isRequired,
    allUsers: PropTypes.object.isRequired,
    destroy: PropTypes.func.isRequired,
    isTp: PropTypes.bool.isRequired,
    playerDead: PropTypes.func.isRequired
};

export default Seat;
