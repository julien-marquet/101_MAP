import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";

import Coalition from "./Coalition";
import SeatRow from "./map/Seatrow";
import HostInfo from "../containers/map/hostinfo";
import SearchBar from "../containers/map/searchBar";
import SideBar from "../containers/sidebar/sideBar";
import Switch from "../containers/switch";
import "../scss/warzone.css";

class Warzone extends Component {
    constructor(props) {
        super(props);
        this.state = {
            extraStyle: ""
        };
        this.switchButton = {
            isDragged: false,
            startPosition: 0,
            canMove: true
        };
        this.switch = null;
        this.timeout = null;
        
        this.selectRandomUsers = this.selectRandomUsers.bind(this);
        this.dragging = this.dragging.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.switchButton.position !== nextProps.switchButton.position) {
            this.switchButton.canMove = true;
        }
    }

    componentWillMount() {
        this.zones = {
            z1: [["r1p1", "r1p2", "r1p3", "r1p4", "r1p5"], ["r2p1", "r2p2", "r2p3", "r2p4", "r2p5"], ["r3p1", "r3p2", "r3p3", "r3p4"], ["r4p1", "r4p2", "r4p3", "r4p4", "r4p5"], ["r5p1", "r5p2", "r5p3", "r5p4", "r5p5"], ["r6p1", "r6p2", "r6p3", "r6p4", "r6p5", "r6p6"], ["r7p1", "r7p2", "r7p3", "r7p4", "r7p5", "r7p6"], ["r8p1", "r8p2", "r8p3", "r8p4", "r8p5"], ["r9p1", "r9p2", "r9p3", "r9p4", "r9p5", "r9p6"], ["r10p1", "r10p2", "r10p3", "r10p4", "r10p5", "r10p6"], ["r11p1", "r11p2", "r11p3", "r11p4", "r11p5"], ["r12p1", "r12p2", "r12p3", "r12p4", "r12p5", "r12p6"], ["r13p1", "r13p2", "r13p3", "r13p4", "r13p5", "r13p6"], ["r14p1", "r14p2", "r14p3", "r14p4", "r14p5"]],      
            z2: [["r1p1", "r1p2", "r1p3", "r1p4", "r1p5", "r1p6"], ["r2p1", "r2p2", "r2p3", "r2p4", "r2p5", "r2p6"], ["r3p1", "r3p2", "r3p3", "r3p4", "r3p5"], ["r4p1", "r4p2", "r4p3", "r4p4", "r4p5", "r4p6"], ["r5p1", "r5p2", "r5p3", "r5p4", "r5p5", "r5p6"], ["r6p1", "r6p2", "r6p3", "r6p4", "r6p5"], ["r7p1", "r7p2", "r7p3", "r7p4", "r7p5", "r7p6"]],
            z3: [["r1p1", "r1p2", "r1p3", "r1p4"], ["r2p1", "r2p2", "r2p3", "r2p4"], ["r3p1", "r3p2", "r3p3", "r3p4"], ["r4p1", "r4p2", "r4p3"], ["r5p1", "r5p2", "r5p3"], ["r6p1", "r6p2", "r6p3", "r6p4"], ["r7p1", "r7p2", "r7p3", "r7p4"], ["r8p1", "r8p2", "r8p3", "r8p4"], ["r9p1", "r9p2", "r9p3", "r9p4"], ["r10p1", "r10p2", "r10p3", "r10p4"]],
            z4: [["r1p1", "r1p2", "r1p3", "r1p4", "r1p5", "r1p6"], ["r2p1", "r2p2", "r2p3", "r2p4", "r2p5", "r2p6"], ["r3p1", "r3p2", "r3p3", "r3p4", "r3p5"], ["r4p1", "r4p2", "r4p3", "r4p4", "r4p5", "r4p6"], ["r5p1", "r5p2", "r5p3", "r5p4", "r5p5", "r5p6"], ["r6p1", "r6p2", "r6p3", "r6p4", "r6p5"], ["r7p1", "r7p2", "r7p3", "r7p4", "r7p5", "r7p6"], ["r8p1", "r8p2", "r8p3", "r8p4", "r8p5", "r8p6"]]
        };
    }

    componentDidMount() {
        if (this.props.mode === "passive") {
            this.props.showToast({
                type: "info",		
                timeout: 2000,
                message: "Press escape to quit passive mode"
            });
            this.selectRandomUsers();
        }
    }

    componentDidUpdate(oldProps) {
        if (this.props.mode === "passive" && oldProps.user_metadata.success !== this.props.user_metadata.success && this.props.user_metadata.success !== null) {
            this.timeout = setTimeout(this.selectRandomUsers, 5000);
        }
        if ((oldProps.users.array.length === 0 && this.props.users.array.length !== 0 && this.props.mode === "passive") ||
            (oldProps.mode !== this.props.mode && this.props.mode === "passive")) {
            if (this.timeout !== null) {
                clearTimeout(this.timeout);
            }
            this.selectRandomUsers();
        }
    }

    selectRandomUsers() {
        if (this.props.mode === "passive") {
            const arrayLength = Object.keys(this.props.users.array).length;
            if (arrayLength > 0) {
                const random = Math.floor(Math.random() * Math.floor(arrayLength));
                this.props.storeActiveUsers({
                    ...this.props.users.array[Object.keys(this.props.users.array)[random]],
                    hostname: Object.keys(this.props.users.array)[random]
                });
            } else if (arrayLength === 0 && this.props.users.activeUser.id !== 0) {
                this.props.clearActiveUser();
            }
        }
    }
  
    renderZones() {
        const zones = [[], []];
        Object.keys(this.zones).map(key => {
            zones[key === "z1" ? 0 : 1].push(
                
            );
            if (key === "z1") {
                zones[0].push(
                    <div
                        className={`zone ${key}`}
                        key={key}
                    >
                        <SeatRow
                            seats={this.zones[key]}
                            zone={key}
                            users={this.props.users}
                        />
                    </div>
                );
            } else if (key === "z3") {
                const coalitions = [...this.props.coalitions];
                coalitions.sort((a, b) => b.score - a.score);
                zones[1].push(
                    <div className={"scoresWrapper"} key={key}>
                        <div className={"coalitionsScores"}>
                            {coalitions.map((coa, key) => <Coalition {...coa} key={`score${key}`} />)}
                        </div>
                        <div
                            className={`zone ${key}`}
                            key={key}
                        >
                            <SeatRow
                                seats={this.zones[key]}
                                zone={key}
                                users={this.props.users}
                            />
                        </div>
                    </div>
                );
            } else {
                zones[1].push(
                    <div
                        className={`zone ${key}`}
                        key={key}
                    >
                        <SeatRow
                            seats={this.zones[key]}
                            zone={key}
                            users={this.props.users}
                        />
                    </div>
                );
            }
            return null;
        });
        return (
            <Fragment>
                <div className={"zoneContainer"}>
                    {zones[0]}
                    <div className={"blockSearchHost"}>
                        <SearchBar />
                        <HostInfo />
                        <div className={"infosBigWrapper"}>
                            <div className={"infosWrapper"}>
                                {this.props.users.inPoolNbr !== 0 &&
                                    <div ref={ref => this.switch = ref}>
                                        <Switch />
                                    </div>}
                                <div className={"globalInfosWrapper"}>
                                    <div className={"global-infos"} style={this.props.switchButton.position === 2 ? {opacity: 0.3} : {}}><i className="fas fa-users"></i><p>{this.props.users.nb_connected_users - this.props.users.inPoolNbr}</p></div>
                                    {this.props.users.inPoolNbr !== 0 && <div className="global-infos" style={this.props.switchButton.position === 0 ? {opacity: 0.3} : {}}><i className="fas"><svg aria-hidden="true" data-prefix="fas" data-icon="swimming-pool" className="poolIcon svg-inline--fa fa-swimming-pool fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M624 416h-16c-26.04 0-45.8-8.42-56.09-17.9-8.9-8.21-19.66-14.1-31.77-14.1h-16.3c-12.11 0-22.87 5.89-31.77 14.1C461.8 407.58 442.04 416 416 416s-45.8-8.42-56.09-17.9c-8.9-8.21-19.66-14.1-31.77-14.1h-16.3c-12.11 0-22.87 5.89-31.77 14.1C269.8 407.58 250.04 416 224 416s-45.8-8.42-56.09-17.9c-8.9-8.21-19.66-14.1-31.77-14.1h-16.3c-12.11 0-22.87 5.89-31.77 14.1C77.8 407.58 58.04 416 32 416H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h16c38.62 0 72.72-12.19 96-31.84 23.28 19.66 57.38 31.84 96 31.84s72.72-12.19 96-31.84c23.28 19.66 57.38 31.84 96 31.84s72.72-12.19 96-31.84c23.28 19.66 57.38 31.84 96 31.84h16c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zm-400-32v-96h192v96c19.12 0 30.86-6.16 34.39-9.42 9.17-8.46 19.2-14.34 29.61-18.07V128c0-17.64 14.36-32 32-32s32 14.36 32 32v16c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16v-16c0-52.94-43.06-96-96-96s-96 43.06-96 96v96H224v-96c0-17.64 14.36-32 32-32s32 14.36 32 32v16c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16v-16c0-52.94-43.06-96-96-96s-96 43.06-96 96v228.5c10.41 3.73 20.44 9.62 29.61 18.07 3.53 3.27 15.27 9.43 34.39 9.43z"></path></svg></i><p>{this.props.users.inPoolNbr}</p></div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"zoneContainer"}>{zones[1]}</div>
            </Fragment>
        );
    }

    dragging({target, clientY}, release = false) {
        if ((this.switchButton.isDragged && release) || target.className.includes("switchButton")) {
            this.switchButton.startPosition = clientY;
            this.switchButton.isDragged = !this.switchButton.isDragged;
            this.switchButton.dragPosition = this.props.switchButton.position;
            this.setState({extraStyle: this.switchButton.isDragged ? "userSelectNone" : ""});
        }
    }

    moveSwitch(position, clientY) {
        this.switchButton.canMove = false;
        this.switchButton.startPosition = clientY;
        this.switchButton.dragPosition = this.props.switchButton.position;
        this.props.moveSwitch(position);
    }

    mouseMove({clientY}) {
        if (this.switch !== null && this.switchButton.isDragged && this.switchButton.canMove) {
            const diff = this.switch.clientHeight / 3 - 3 * (this.switch.clientHeight / 20);
            const position = this.switchButton.startPosition - clientY;
            const absPosition = Math.abs(position);
            if (position > 0) {
                if (absPosition > diff * 2 && this.props.switchButton.position !== 0) {
                    this.moveSwitch(0, clientY);
                } else if (absPosition > diff && absPosition <
                diff * 2 && this.props.switchButton.position > 0 &&
                    Math.abs((this.props.switchButton.position - 1) - this.switchButton.dragPosition) <= 1) {
                    this.moveSwitch(this.props.switchButton.position - 1, clientY);
                }
            } else {
                if (absPosition > diff * 2 && this.props.switchButton.position !== 2) {
                    this.moveSwitch(2, clientY);
                } else if (absPosition > diff && absPosition < diff * 2 && this.props.switchButton.position < 2 &&
                    Math.abs((this.props.switchButton.position + 1) - this.switchButton.dragPosition) <= 1) {
                    this.moveSwitch(this.props.switchButton.position + 1, clientY);
                }
            }
        }
    }
  
    render() {
        return (
            <div
                className={`wrapper ${this.state.extraStyle}`}
                onMouseUp={event => this.dragging(event, true)}
                onMouseDown={this.dragging}
                onMouseMove={this.mouseMove}
            >
                <SideBar />
                <div className={"zonesWrapper"}>
                    <div className="content">
                        {this.renderZones()}
                    </div>
                </div>
            </div>
        );
    }
}

Warzone.propTypes = {
    switchButton: PropTypes.object.isRequired,
    moveSwitch: PropTypes.func.isRequired,
    storeActiveUsers: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
    clearActiveUser: PropTypes.func.isRequired,
    coalitions: PropTypes.array.isRequired,
    user_metadata: PropTypes.object.isRequired
};

export default Warzone;
