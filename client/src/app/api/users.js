import globalConfig from "../../config/globalConfig";
import {retrieveCookie} from "../helpers/cookies.helper";

export const getUserInfos = userId => {
    const userToken = retrieveCookie("userToken");
    return fetch(`${globalConfig.apiEndPoint}/v2/users/${userId}`, {
        headers: {"authorization": `Bearer ${userToken}`}
    })
        .then(response => response.json())
        .catch(error => {
            return {error};
        });
};
