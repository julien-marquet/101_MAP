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

    keyDown({keyCode}) {
        if (!this.props.connected) {
            if (keyCode === 32 || keyCode === 13) {
                this.askCode();
            }
        }
        else {
            if (this.props.mode === "passive") {
                if (keyCode === 27 || keyCode === 70) {
                    this.props.quitPassiveMode();
                    localStorage.removeItem("mode");
                }
            }
            else {
                if (keyCode === 70 && !(document.getElementsByTagName("input")[0] === document.activeElement)) {
                    this.props.setPassiveMode();
                    localStorage.setItem("mode", "passive");
                    this.props.showToast({
                        type: "info",		
                        timeout: 2000,
                        message: "Press escape to quit passive mode"
                    });
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
                <Loader key="ComponentLoader" in={this.state.loading}/>
                {this.renderApp()}
                <Toaster />
            </div>
        );
    }
}

App.propTypes = {
    socket: PropTypes.object.isRequired,
    searchFocused: PropTypes.bool
};

export default App;