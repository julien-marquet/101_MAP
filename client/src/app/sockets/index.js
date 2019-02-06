import io from "socket.io-client";

import config from "../../config/globalConfig";
import {storeCookie} from "../helpers/cookies.helper";

class SocketClient {
    constructor() {
        this.socket = null;
    }

    connect(code, token) {
        this.socket = io.connect(config.serverEndpoint, {query: {code, token}});
        this.socket.on("token.refreshed", token => {
            storeCookie("userToken", token);
            this.socket.query.token = token;
        });
        return new Promise((resolve, reject) => {
            this.socket.on("connect", () => resolve());
            this.socket.on("connect_error", error => reject(error));
            this.socket.on("connect_timeout", error => reject(error));
            this.socket.on("error", error => reject(error));
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            if (this.socket === null)
                return reject("No socket connection.");
            this.socket.disconnect(() => {
                this.socket = null;
                resolve();
            });
        });
    }

    emit(event, data) {
        return new Promise((resolve, reject) => {
            if (this.socket === null)
                return reject("No socket connection.");
            return this.socket.emit(event, data, response => {
                if (response.error === null) {
                    return reject(response.error);
                }
                return resolve();
            });
        });
    }

    on(event, fun) {
        return new Promise((resolve, reject) => {
            if (this.socket === null)
                return reject("No socket connection.");
            this.socket.on(event, fun);
            resolve();
        });
    }
}

export default SocketClient;
