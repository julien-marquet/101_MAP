import React, {Component} from "react";
import PropTypes from "prop-types";

import UpTime from "./Uptime";
import Loader from "../Loader";
import placeholder from "../../../img/placeholder_profil.svg";

class HostInfo extends Component {
    constructor(props) {
        super(props);

        this.portrait = null;

        this.addDefaultSrc = this.addDefaultSrc.bind(this);
        this.renderMetadata = this.renderMetadata.bind(this);
        this.renderTags = this.renderTags.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.activeUser.id !== nextProps.activeUser.id && nextProps.activeUser.id !== 0) {
            this.props.getUserMetadata(nextProps.activeUser.login);
            if (this.portrait !== null) {
                if (this.portrait.className !== "userPortrait") {
                    this.portrait.className = "userPortrait";
                }
            }
        }
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.activeUser.login !== nextProps.activeUser.login ||
        nextProps.user_metadata.success !== this.props.user_metadata.success ||
        this.props.mode !== nextProps.mode)
            return (true);
        return (false);
    }

    addDefaultSrc(ev) {
        if (this.props.activeUser.login === null) {
            ev.target.src = placeholder;
        }
        else {
            if (!this.props.activeUser.pool && ev.target.src.slice(-3) === "jpg") {
                ev.target.src = placeholder;
                if (ev.target.className !== "userPortrait") {
                    ev.target.className = "userPortrait";
                }
            }
            else {
                ev.target.src = `https://cdn.intra.42.fr/users/large_${this.props.activeUser.login}.jpg`;
            }
        }
    }

    renderFilter(login) {
        if (login === "legrivel" || login === "jmarquet") {
            return (
                <div className={"adminFilter"}>
                    <h2>Admin</h2>
                </div>
            );
        } else if (this.props.activeUser.pool) {
            return (
                <div className={"poolTag"}>
                    <h2>Piscineux</h2>
                </div>
            );
        }
        else {
            return ;
        }
    }

    renderTags() {        
        if (this.props.activeUser.login === "jfeve") {
            return (
                <div className={"tags jfeve"}>
                    <p>{"Le flamboyant"}</p>
                </div>
            );
        }
        if (this.props.activeUser.login === "hugrebou") {
            return (
                <div className={"tags hugrebou"}>
                    <p>{"New hope"}</p>
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
            const level = this.props.user_metadata.content.cursus_users.find(obj => obj.cursus_id === 1 || obj.cursus_id === 10 || obj.cursus_id === 21) || this.props.user_metadata.content.cursus_users.find(obj => obj.cursus_id !== 1);
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
                            {level.level.toFixed(2)}
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
                {userIsActive && this.props.mode !== "passive" && <i className={"fas fa-times closeHostInfo"} onClick={this.props.clearActiveUser}></i>}
                <div className={"splitter"}>
                    <div className={"leftCol"}>
                        {userIsActive &&
                            <React.Fragment>
                                <img
                                    className={"userPortrait"}
                                    onError={this.addDefaultSrc}
                                    ref={element => this.portrait = element}
                                    src={`https://cdn.intra.42.fr/users/large_${this.props.activeUser.login}.JPG`}
                                    alt={"User portrait"}
                                />
                                {this.renderFilter(this.props.activeUser.login)}
                            </React.Fragment>
                        }
                    </div>
                    <div className={`rightCol ${this.props.activeUser.login === "jfeve" ? "jfeve" : ""}`}>
                        <div className={"main skewed"} />
                        <div className={"secondary skewed"} >
                            <div className={"hostName"}>
                                {userIsActive && <p>{this.props.activeUser.hostname}</p>}
                            </div>
                        </div>
                        <div className={"contentTop hostContent"} >
                            {userIsActive &&
                                <React.Fragment>
                                    <div className={"userName"}>
                                        <h2>{this.props.activeUser.login}</h2>
                                    </div>
                                    {this.renderTags()}
                                </React.Fragment>
                            }
                            {this.props.user_metadata.content !== null && this.props.user_metadata.content.coalition !== null && this.props.user_metadata.content.coalition !== undefined &&
                                <div className={"bannerWrapper"}>
                                    <div className={"absoluteWrapper"}>
                                        <svg style={{fill: this.props.user_metadata.content.coalition.color}} className={"banner"} xmlns="http://www.w3.org/2000/svg" version="1.1" id="banner" x="0px" y="0px" viewBox="0 0 68 104">
                                            <g id="banner-content">
                                                <g id="UI-Intranet-banner-content" transform="translate(-96.000000, -60.000000)">
                                                    <g id="banner-content-g-1" transform="translate(96.000000, 60.000000)">
                                                        <polygon id="banner-content-polygon-1" points="0,0 0,80.5 34.3,104 68,80.5 68,0"></polygon>
                                                    </g>
                                                </g>
                                            </g>
                                        </svg>
                                    </div>
                                    <div className={"absoluteWrapper"}>
                                        <img
                                            style={{maxHeight: this.props.user_metadata.content.coalition.slug === "ranger" ? "50%" : "60%"}}
                                            className={"bannerLogo"}
                                            src={this.props.user_metadata.content.coalition.image_url}
                                            alt={"Coalition"}
                                        />
                                    </div>
                                </div>
                            }
                        </div>
                        {userIsActive && <Loader key="hostInfoLoader" name={"HostInfo"} in={this.props.user_metadata.success === null}/>}
                        <div className={"contentBottom hostContent"} >
                            {userIsActive &&
                                <React.Fragment>
                                    <ul className={"stats"}>
                                        {this.renderMetadata()}
                                    </ul>
                                    <a className={"profileButton"} href={"https://profile.intra.42.fr/users/" + this.props.activeUser.login}>
                                        <div className={"buttonSkewed"} />
                                        <div className={"buttonContent"}>
                                            <div className={"linkUserAccount"} >
                                                <span>Profile</span>
                                            </div>
                                        </div>
                                    </a>
                                </React.Fragment>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

HostInfo.propTypes = {
    activeUser: {
        hostname: PropTypes.string,
        begin_at: PropTypes.string,
		login: PropTypes.string
    },
    user_metadata: PropTypes.shape({
        success: PropTypes.bool,
        content: PropTypes.object
    }),
    mode: PropTypes.string
};

export default HostInfo;
