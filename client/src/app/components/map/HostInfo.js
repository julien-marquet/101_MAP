import React, {Component} from "react";
import PropTypes from "prop-types";
import UpTime from "./Uptime";
import placeholder from "../../../img/placeholder_profil.svg";

class HostInfo extends Component {
    constructor(props) {
        super(props);

        this.addDefaultSrc = this.addDefaultSrc.bind(this);
    }

    addDefaultSrc(ev) {
        if (this.props.activeUser.user.login === null) {
            ev.target.src = placeholder;
        }
        else {
            if (ev.target.src.slice(-3) === "jpg") {
                ev.target.src = placeholder;
            }
            else {
                ev.target.src = `https://cdn.intra.42.fr/users/large_${this.props.activeUser.user.login}.jpg`;
                ev.target.className = "userPortrait42";
            }
        }
    }

    render() {
        if (!this.props.activeUser.hostname)
        {
            return (
                <div className={"hostInfoWrapper"}>
                    <div className={"splitter"}>
                        <div className={"leftCol"}>
                        </div>
                        <div className={"rightCol"}>
                            <div className={"main skewed"} />
                            <div className={"secondary skewed"} >
                                <div className={"hostName"}>
                                </div>
                            </div>
                            <div className={"contentTop hostContent"} >
                            </div>
                            <div className={"contentBottom hostContent"} >
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className={"hostInfoWrapper"}>
                <div className={"splitter"}>
                    <div className={"leftCol"}>
                        <img
                            className={"userPortrait"}
                            onError={this.addDefaultSrc}
                            src={`https://cdn.intra.42.fr/users/large_${this.props.activeUser.user.login}.JPG`}
                            alt={"User portrait"}
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

HostInfo.proptypes = {
    activeUser: {
        hostname: PropTypes.string,
        begin_at: PropTypes.string,
        user: PropTypes.shape({
            login:PropTypes.string,
        })
    }
};

export default HostInfo;
