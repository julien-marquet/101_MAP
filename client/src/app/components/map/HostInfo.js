import React, {Component} from "react";
import UpTime from "./Uptime";
import placeholder from "../../../img/placeholder_profil.svg";

class HostInfo extends Component {
    constructor(props) {
        super(props);

        this.addDefaultSrc = this.addDefaultSrc.bind(this);
    }
    addDefaultSrc(ev) {
        const ext = ev.target.src.slice(-3);
        if(this.props.activeUser !== undefined && ext !== "jpg" && ext !== "svg") {
            ev.target.src = `https://cdn.intra.42.fr/users/large_${this.props.activeUser.user.login}.jpg`;
            ev.target.className = "userPortrait42";
        }
        else if (this.props.activeUser !== undefined && ext === "jpg")
            ev.target.src = placeholder;
    }	
    render() {
        return (
            <div className={"hostInfoWrapper"}>
                <div className={"splitter"}>
                    <div className={"leftCol"}>
                        <img
                            className={"userPortrait"}
                            onError={this.addDefaultSrc}
                            src={`https://cdn.intra.42.fr/users/large_${this.props.activeUser.user.login}.JPG`}
                        />
                    </div>
                    <div className={"rightCol"}>
                        <div className={"main skewed"} />
                        <div className={"secondary skewed"} >
                            <div className={"hostName"}>
                                <p>{this.props.activeUser.hostname}</p>
                            </div>
                        </div>
                        <div className={"contentTop hostContent"} >
                            <div className={"userName"}>
                                <h2>{this.props.activeUser.user.login}</h2>
                            </div>
                            <div className={"tags inactive"}>
                                <p>{"No tags"}</p>
                            </div>
                        </div>
                        <div className={"contentBottom hostContent"} >
                            <ul className={"stats"}>
                                <UpTime begin_at={this.props.activeUser.begin_at} />
                            </ul>
                            <a className={"profileButton"} href={"https://profile.intra.42.fr/users/" + this.props.activeUser.user.login}>
                                <div className={"buttonSkewed"} />
                                <div className={"buttonContent"}>
                                    <div className={"linkUserAccount"} >
                                        <span>Profile</span>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HostInfo;
