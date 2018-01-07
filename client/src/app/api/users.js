import globalConfig from "../../config/globalConfig";
import {retrieveCookie} from "../helpers/cookies.helper";

const userToken = retrieveCookie("userToken");

export const getUserInfos = userId => {
    return fetch(`${globalConfig.apiEndPoint}/v2/users/${userId}`, {
        headers: {"authorization": `Bearer ${userToken}`}
    })
        .then(response => response.json())
        .catch(error => {
            return {error};
        });
};
