import React, {Component} from "react";
import PropTypes from "prop-types";

import {retrieveCookie, removeCookie} from "../helpers/cookies.helper";
import Warzone from "../containers/warzone";
import config from "../../config/globalConfig";
import logo_light from "../../img/101_logo_light.svg";
import logo_dark from "../../img/101_logo_dark.svg";
import Loader from "../components/Loader";
import Toaster from "../containers/toaster";
import "../scss/App.css";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };

        this.konami = {
            valid: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
            entered: []
        };
        this.logoTheme = [logo_dark, logo_light];
        
        this.askCode = this.askCode.bind(this);
        this.keyDown = this.keyDown.bind(this);
    }
    
    componentDidMount() {
        this.checkConnection();
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyDown);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.connected && !nextProps.connected) {
            this.props.socket.disconnect();
        }
        if (this.props.connected !== nextProps.connected && nextProps.connected) {
            this.setState({loading: false});
        }
    }

    checkKonami(keyCode) {
        this.konami.entered.push(keyCode);
        const length = this.konami.entered.length - 1;
        if (this.konami.entered[length] !== this.konami.valid[length]) {
            this.konami.entered = [];
        }
        else if (this.konami.entered.length === this.konami.valid.length &&
            this.konami.entered[length] === this.konami.valid[length]) {
            window.location = config.konamiUrl;
        }
    }

    keyDown({keyCode}) {
        if (!this.props.connected) {
            if (keyCode === 32 || keyCode === 13) {
                this.askCode();
            }
        }
        else {
            if (!(document.getElementsByTagName("input")[0] === document.activeElement)) {
                this.checkKonami(keyCode);
                if (keyCode === 72) {
                    this.props.moveSwitch(this.props.switchButton.position === 2 ? 0 : this.props.switchButton.position + 1);
                } else if (keyCode === 84) {
                    this.props.storeActiveTheme(this.props.themes.value === 1 ? {value: 0} : {value: 1});
                }
            }
            if (this.props.mode === "passive") {
                if (keyCode === 27 || keyCode === 70) {
                    this.props.quitPassiveMode();
                    localStorage.removeItem("mode");
                }
            }
            else {
                if (!(document.getElementsByTagName("input")[0] === document.activeElement)) {
                    if (keyCode === 70) {
                        this.props.setPassiveMode();
                        localStorage.setItem("mode", "passive");
                        this.props.showToast({
                            type: "info",		
                            timeout: 2000,
                            message: "Press escape to quit passive mode"
                        });
                    }
                }
                if (keyCode === 27) {
                    this.props.clearActiveUser();
                }
            }
        }
    }

    checkConnection() {
        const params = new URLSearchParams(window.location.search);
        const userToken = retrieveCookie("userToken");
        if (userToken || params.get("code")) {
            this.props.socket.connect(params.get("code"), userToken)
                .then(() => {
                    this.props.connectApp();
                    document.addEventListener("keydown", this.keyDown);
                })
                .catch(()=> {
                    removeCookie("userToken");
                    this.setState({loading: false});
                    document.addEventListener("keydown", this.keyDown);
                });
        }
        else {
            this.setState({loading:false});
            document.addEventListener("keydown", this.keyDown);
        }
    }

    askCode() {
        window.location.replace(`${config.apiEndPoint}/oauth/authorize?client_id=${config.clientId}&redirect_uri=${config.redirectUri}&response_type=code`);
    }

    renderApp() {
        if (this.props.connected) {
            return (<Warzone key={"Component1"} />);
        }
        else {
            return (
                <div key={"Component0"} className="wrapper">
                    <div className={"loginWrapper"}>
                        <h1>The Matrix</h1>
                        <img
                            className={"logo"}
                            src={this.logoTheme[this.props.themes.value]}
                            alt={"Logo"}
                        />
                        <div
                            className={"loginButton"}
                            onClick={this.askCode}
                        >
                            <p>{"Login"}</p>
                        </div>
                    </div>
                </div>
            );
        }
    }

    render() {
        return (
            <div className={`themeWrapper ${this.props.themes.array[this.props.themes.value]}`}>
                <Loader key="ComponentLoader" in={this.state.loading} />
                {this.renderApp()}
                <Toaster />
            </div>
        );
    }
}

App.propTypes = {
    socket: PropTypes.object.isRequired,
    searchFocused: PropTypes.bool,
    moveSwitch: PropTypes.func.isRequired,
    switchButton: PropTypes.object.isRequired,
    clearActiveUser: PropTypes.func.isRequired,
    storeActiveTheme: PropTypes.func.isRequired
};

export default App;
