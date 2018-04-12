import React, {Component} from "react";
import PropTypes from "prop-types";

import UpTime from "./Uptime";
import Loader from "../Loader";
import placeholder from "../../../img/placeholder_profil.svg";
import jfeve from "../../../img/jfeve.gif";

class HostInfo extends Component {
    constructor(props) {
        super(props);

        this.portrait = null;

        this.addDefaultSrc = this.addDefaultSrc.bind(this);
        this.renderMetadata = this.renderMetadata.bind(this);
        this.renderTags = this.renderTags.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.activeUser.id !== nextProps.activeUser.id) {
            this.props.getUserMetadata(nextProps.activeUser.user.id);
            if (this.portrait !== null) {
                if (this.portrait.className !== "userPortrait") {
                    this.portrait.className = "userPortrait";
                }
            }
        }
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.activeUser.user.login !== nextProps.activeUser.user.login ||
        nextProps.user_metadata.success !== this.props.user_metadata.success ||
        this.props.mode !== nextProps.mode)
            return (true);
        return (false);
    }

    addDefaultSrc(ev) {
        if (this.props.activeUser.user.login === null) {
            ev.target.src = placeholder;
        }
        else {
            if (ev.target.src.slice(-3) === "jpg") {
                ev.target.src = placeholder;
                if (ev.target.className !== "userPortrait") {
                    ev.target.className = "userPortrait";
                }
            }
            else {
                ev.target.src = `https://cdn.intra.42.fr/users/large_${this.props.activeUser.user.login}.jpg`;
            }
        }
    }

    renderFilter(login) {
        if (login === "jfeve") {
            return (
                <img
                    className={"fireJfeve"}
                    src={jfeve}
                    alt={"jFeve"}
                />
            );
        }
        else if (login === "legrivel" || login === "jmarquet") {
            return (
                <div className={"adminFilter"}>
                    <h2>Admin</h2>
                </div>
            );
        }
        else {
            return ;
        }
    }

    renderTags() {        
        if (this.props.activeUser.user.login === "jfeve") {
            return (
                <div className={"tags jfeve"}>
                    <p>{"Le flamboyant"}</p>
                </div>
            );
        }
        if (this.props.activeUser.user.login === "hugrebou") {
            return (
                <div className={"tags hugrebou"}>
                    <p>{"Seigneur Sith"}</p>
                </div>
            );
        }
        else if (!this.props.user_metadata.success || this.props.user_metadata.content.titles.length === 0) 
        {
            return (
                <div className={"tags inactive"}>
                    <p>{"No tags"}</p>
                </div>
            );
        }
        else {
            return (
                <div className={"tags active"}>
                    <p>{this.props.user_metadata.content.titles.splice(0, 2).map(elem => {
                        return elem.name.split(" ")[0];
                    }).join(", ")}
                    </p>
                </div>
            );
        }
    }
    renderMetadata() {
        if (this.props.user_metadata.success) {
            return [
                <UpTime  key={"s-uptime"} begin_at={this.props.activeUser.begin_at} />,
                <li key="s-corr" className={"stat stat-2"}>
                    <p>
                        <span className={"statName"}>
                        Correction points :
                        </span>
                        <span className={"statValue"}>
                            {this.props.user_metadata.content.correction_point}
                        </span>    
                    </p>
                </li>,
                <li key="s-wallet" className={"stat stat-3"}>
                    <p>
                        <span className={"statName"}>
                        Wallet :
                        </span>
                        <span className={"statValue"}>
                            {this.props.user_metadata.content.wallet}
                        </span>    
                    </p>
                </li>,
                <li key="s-level" className={"stat stat-4"}>
                    <p>
                        <span className={"statName"}>
                        Level :
                        </span>
                        <span className={"statValue"}>
                            {this.props.user_metadata.content.cursus_users.find(obj => obj.cursus_id === 1).level.toFixed(2)}
                        </span>    
                    </p>
                </li>
            ];
        }
    }

    render() {
        const userIsActive = this.props.activeUser.hostname !== null;
        return (
            <div className={this.props.mode === "passive" ? "hostInfoWrapper hostInfoAnimated" : "hostInfoWrapper"}>
                <div className={"splitter"}>
                    <div className={"leftCol"}>
                        {userIsActive &&
                            [<img
                                className={"userPortrait"}
                                onError={this.addDefaultSrc}
                                ref={element => this.portrait = element}
                                src={`https://cdn.intra.42.fr/users/large_${this.props.activeUser.user.login}.JPG`}
                                alt={"User portrait"}
                            />,
                            this.renderFilter(this.props.activeUser.user.login)]
                        }
                    </div>
                    <div className={"rightCol"}>
                        <div className={"main skewed"} />
                        <div className={"secondary skewed"} >
                            <div className={"hostName"}>
                                {userIsActive && <p>{this.props.activeUser.hostname}</p>}
                            </div>
                        </div>
                        <div className={"contentTop hostContent"} >
                            {userIsActive &&
                                [<div className={"userName"}>
                                    <h2>{this.props.activeUser.user.login}</h2>
                                </div>,
                                this.renderTags()]
                            }
                        </div>
                        {userIsActive && <Loader key="hostInfoLoader" name={"HostInfo"} in={this.props.user_metadata.success === null}/>}
                        <div className={"contentBottom hostContent"} >
                            {userIsActive &&
                                [<ul className={"stats"}>
                                    {this.renderMetadata()}
                                </ul>,
                                <a className={"profileButton"} href={"https://profile.intra.42.fr/users/" + this.props.activeUser.user.login}>
                                    <div className={"buttonSkewed"} />
                                    <div className={"buttonContent"}>
                                        <div className={"linkUserAccount"} >
                                            <span>Profile</span>
                                        </div>
                                    </div>
                                </a>]
                            }
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
    },
    user_metadata: PropTypes.shape({
        success: PropTypes.bool,
        content: PropTypes.object
    }),
    mode: PropTypes.string
};

export default HostInfo;
