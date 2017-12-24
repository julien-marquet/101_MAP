import React, {Component} from "react";
import PropTypes from "prop-types";

import {retrieveCookie, removeCookie} from "../helpers/cookies.helper";
import Sockets from "../containers/sockets";
import Warzone from "../containers/warzone";
import config from "../../config/globalConfig";
import logo from "../../img/101_logo.svg";
import Loader from "../components/Loader";
import "../scss/App.css";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            connected: false, 
            loading: true,
            theme: this.props.themes.value
        };

        this.askCode = this.askCode.bind(this);
    }
    
    componentDidMount() {
        this.checkConnection();
    }

    checkConnection() {
        const params = new URLSearchParams(window.location.search);
        const userToken = retrieveCookie("userToken");
        if (userToken || params.get("code")) {
            this.props.socket.connect(params.get("code"), userToken)
                .then(() => {
                    this.setState({connected: true, loading: false});
                })
                .catch(()=> {
                    removeCookie("userToken");
                    this.setState({loading: false});
                });
        }
        else {
            this.setState({loading:false});
        }
    }

    askCode() {
        window.location.replace(`${config.apiEndPoint}/oauth/authorize?client_id=${config.clientId}&redirect_uri=${config.redirectUri}&response_type=code`);
    }

    renderApp() {
        if (this.state.connected) {
            return [
                <Sockets key={"Component0"} socket={this.props.socket} />,
                <Warzone key={"Component1"} />
            ];
        }
        else {
            return (
                <div key={"Component0"} className="wrapper">
                    <h1>WarZone</h1>
                    <img
                        className={"logo"}
                        src={logo}
                    />
                    <div
                        className={"loginButton"}
                        onClick={this.askCode}
                    >
                        <p>{"Login"}</p>
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
            </div>
        );
    }
}

App.propTypes = {
    socket: PropTypes.object.isRequired
};

export default App;