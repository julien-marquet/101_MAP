import React, {Component, Fragment} from "react";

import SeatRow from "./map/Seatrow";
import HostInfo from "../containers/hostinfo";
import SideBar from "../components/SideBar";
import ThemeSwitch from "../containers/themeSwitch";
import DisconnectSwitch from "../containers/disconnectSwitch";
import "../scss/warzone.css";

class Warzone extends Component {
    componentWillMount() {
        this.zones = {
            z1: [["r1p1", "r1p2", "r1p3", "r1p4", "r1p5"], ["r2p1", "r2p2", "r2p3", "r2p4", "r2p5"], ["r3p1", "r3p2", "r3p3", "r3p4"], ["r4p1", "r4p2", "r4p3", "r4p4", "r4p5"], ["r5p1", "r5p2", "r5p3", "r5p4", "r5p5"], ["r6p1", "r6p2", "r6p3", "r6p4", "r6p5", "r6p6"], ["r7p1", "r7p2", "r7p3", "r7p4", "r7p5", "r7p6"], ["r8p1", "r8p2", "r8p3", "r8p4", "r8p5"], ["r9p1", "r9p2", "r9p3", "r9p4", "r9p5", "r9p6"], ["r10p1", "r10p2", "r10p3", "r10p4", "r10p5", "r10p6"], ["r11p1", "r11p2", "r11p3", "r11p4", "r11p5"], ["r12p1", "r12p2", "r12p3", "r12p4", "r12p5", "r12p6"], ["r13p1", "r13p2", "r13p3", "r13p4", "r13p5", "r13p6"], ["r14p1", "r14p2", "r14p3", "r14p4", "r14p5"]],      
            z2: [["r1p1", "r1p2", "r1p3", "r1p4", "r1p5", "r1p6"], ["r2p1", "r2p2", "r2p3", "r2p4", "r2p5", "r2p6"], ["r3p1", "r3p2", "r3p3", "r3p4", "r3p5"], ["r4p1", "r4p2", "r4p3", "r4p4", "r4p5", "r4p6"], ["r5p1", "r5p2", "r5p3", "r5p4", "r5p5", "r5p6"], ["r6p1", "r6p2", "r6p3", "r6p4", "r6p5"], ["r7p1", "r7p2", "r7p3", "r7p4", "r7p5", "r7p6"]],
            z3: [["r1p1", "r1p2", "r1p3", "r1p4"], ["r2p1", "r2p2", "r2p3", "r2p4"], ["r3p1", "r3p2", "r3p3", "r3p4"], ["r4p1", "r4p2", "r4p3"], ["r5p1", "r5p2", "r5p3"], ["r6p1", "r6p2", "r6p3", "r6p4"], ["r7p1", "r7p2", "r7p3", "r7p4"], ["r8p1", "r8p2", "r8p3", "r8p4"], ["r9p1", "r9p2", "r9p3", "r9p4"], ["r10p1", "r10p2", "r10p3", "r10p4"]],
            z4: [["r1p1", "r1p2", "r1p3", "r1p4", "r1p5", "r1p6"], ["r2p1", "r2p2", "r2p3", "r2p4", "r2p5", "r2p6"], ["r3p1", "r3p2", "r3p3", "r3p4", "r3p5"], ["r4p1", "r4p2", "r4p3", "r4p4", "r4p5", "r4p6"], ["r5p1", "r5p2", "r5p3", "r5p4", "r5p5", "r5p6"], ["r6p1", "r6p2", "r6p3", "r6p4", "r6p5"], ["r7p1", "r7p2", "r7p3", "r7p4", "r7p5", "r7p6"], ["r8p1", "r8p2", "r8p3", "r8p4", "r8p5", "r8p6"]]
        };
    }
  
    renderZones() {
        const zones = [[], []];
        Object.keys(this.zones).map(key => {
            zones[key === "z1" ? 0 : 1].push(
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
        });
        return (
            <Fragment>
                <div className={"zoneContainer"}>
                    {zones[0]}
                    <HostInfo />
                </div>
                <div className={"zoneContainer"}>{zones[1]}</div>
            </Fragment>
        );
    }
  
    render() {
        return (
            <div className={"wrapper"}>
                <SideBar />
                <div className={"zonesWrapper"}>
                    {this.renderZones()}
                </div>
            </div>
        );
    }
}

export default Warzone;
