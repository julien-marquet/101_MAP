const users_func = require("./Users.func"),
    logger = require("../custom_modules/logger"),
    {apiEndpoint, connectedUsers_cacheExpiration} = require("../config/globalConfig");

class Users {
    constructor(globalStorage, Oauth2_authenticator, i_queue) {
        this.globalStorage = globalStorage;
        this.globalStorage.usersInfos = {};
        this.i_queue = i_queue;
        this.Oauth2_authenticator = Oauth2_authenticator;
    }

    getUserInfos(userId, userToken) {
        if (this.globalStorage.usersInfos[userId] === undefined) {
            return this.i_queue.push_tail(
                "getUserInfos", {
                    url: `${apiEndpoint}v2/users/${userId}`, 
                    headers: {"authorization": `Bearer ${userToken}`}
                }
            )
                .then(response => {
                    response.last_request = Date.now();
                    this.globalStorage.usersInfos[response.id] = response;
                    return ({response});
                })
                .catch(err => {
                    if (err && err.infos && err.infos.status === 401) {
                        return this.Oauth2_authenticator.refreshToken(userToken)
                            .then((refreshed) => {
                                if (refreshed) {
                                    return this.i_queue.push_tail(
                                        "getUserInfos", {
                                            url: `${apiEndpoint}v2/users/${userId}`, 
                                            headers: {"authorization": `Bearer ${refreshed}`
                                            }
                                        }
                                    ).then(response => {
                                        response.last_request = Date.now();
                                        this.globalStorage.usersInfos[response.id] = response;
                                        return ({response, refresh_token: refreshed});
                                    });
                                } else {
                                    logger.add_log({
                                        type: "Error",
                                        description: "Try to refresh...",
                                        additionnal_infos: {userToken, refreshedToken: refreshed}
                                    });
                                    throw ("try to refresh, no existing entry");
                                }
                            })
                            .catch(error => {
                                logger.add_log({
                                    type: "Error", 
                                    description: "An unknown error during token refresh",
                                    additionnal_infos: {Error: error}
                                });
                                throw ("Couldn't refresh token");
                            });
                    }
                });
        }
        else {
            if ((Date.now() - this.globalStorage.usersInfos[userId].last_request) / 1000 > connectedUsers_cacheExpiration * 60) {
                delete(this.globalStorage.usersInfos[userId]);
                return (this.getUserInfos(userId, userToken));
            }
            else {
                return new Promise(resolve => resolve({response: this.globalStorage.usersInfos[userId]}));
            }
        }
    }

    getConnectedUsers(campus)  {
        const inPool = ["sesoubei", "aennaji", "nbenkhel", "spetitcu", "schebbal", "hchretie", "sgouspil", "bhoudaye", "proibet", "bryloyso", "lerossi", "julgonza", "hros", "shamlaou", "mel-kada", "sacduboi", "yfrancoi", "gatagne-", "srafraf", "tbost", "tvu-tran", "couangra", "bnicolin", "slopez", "gmontana", "jtriquen", "cagirard", "jadonvez", "scoborlo", "rspennic", "agoublai", "ntardieu", "ssolaris", "kgourdon", "rsaid", "mmsadek", "kportela", "esnicode", "jbochard", "aaudrain", "lbrulin", "troux", "ggourouv", "abouysso", "rpace", "vmichel", "pduhard-", "aplat", "gdhombre", "vpouplie", "sferrara", "lbelabbe", "jbritel", "glima", "agirerd", "morion", "maxigarc", "iherceg", "beduroul", "aducimet", "bbeaugeo", "guchalin", "boguille", "fcabrero", "dphimana", "lperron", "jfaucoeu", "rblanc", "jollacro", "lomullan", "avan-hoe", "afillit", "hquitton", "nmordele", "ymagnin", "smazzole", "flhivert", "sbrugier", "sferrand", "dginisty", "ldiaz", "kavril", "flima", "mpouplie", "aallombe", "mbogey", "marey", "mroustan", "fmesa--g", "rbratu", "bleclerc", "asaba", "loregnie", "thbrouss", "tcoelho", "lyehamro", "ellucas", "alaval", "qbarrier", "flsena", "msoufi", "gmonacho", "lubrun", "jlakehal", "tbonnamo", "lodumoul", "quhusler", "bhiraux", "lamanso", "mebektas", "mbobillo", "avitcoq", "izoukhai", "mmeinier", "arvasila", "lrey", "jarcher", "vgras", "jgerbe", "kgrosjea", "alletang", "igbraude", "adrgarci", "cflory", "apoulat", "sarobber", "amaune", "cmarecha", "lwourms", "galouis", "itoure", "mmuhamma", "trouress", "dyldos-s", "cgarrot", "gauberti", "bcognard", "jcartero", "lcapogna", "hpezot", "baudu", "lbelot", "elouis", "lfaria", "ccantin", "rcaumett", "jupillet", "aerben", "ncorreia", "temeyer", "flachkar", "agantelm", "calin", "athiriot", "begruget", "rgermain", "mizore", "mmuri", "ftilly", "fsalvi", "rsereir", "fahamzao", "seanseau", "jbongond", "eperrimb", "hmichel", "maegaspa", "gataille", "tperrill", "mmekaoui", "moboussa", "ruhlen", "dfeuilla", "maduclos", "chgaroux", "agiordan", "simrossi", "mwaterso", "vdoury", "mtaquet", "bsauvage", "npage-le", "themarch", "sacadilh", "mkhelouf", "dgouin", "vveyrat-", "jduplan", "angauber", "lulemair", "cpanico", "rodet", "ylounis", "fchapela", "aburnich", "epoggio", "jmoes", "qpupier", "lisimana", "cgandria", "yboitel", "jucollet", "rmarquet", "clroyet", "julgauth", "tclerc-p", "sboumedi", "hfaycal"];
        return new Promise((resolve, reject) => {
            let i = 1;
            let usersArray = [];
            let self = this;
            let nb_connected_users = 0;
            (function loop() {
                if (i !== -1) {
                    self.Oauth2_authenticator.getToken().then(token => {
                        users_func.getPageOfConnectedUsers(token, campus, i, self.i_queue.push_head.bind(self.i_queue)).then(pageArray => {
                            if (!pageArray || pageArray.length < 30) {
                                if (pageArray && pageArray.length > 0) {
                                    pageArray = users_func.selectValid(pageArray);
                                    usersArray = usersArray.concat(pageArray);
                                    nb_connected_users += pageArray.length;
                                }
                                i = -1;
                            }
                            else if (pageArray !== null){
                                pageArray = users_func.selectValid(pageArray);
                                usersArray = usersArray.concat(pageArray);
                                nb_connected_users += pageArray.length;
                                i++;
                            }
                            else {
                                i = -1;
                            }
                            loop();
                        }).catch(err => reject(err));
                    }).catch(err => reject(err));
                } else {
                    let inPoolNbr = 0;
                    self.globalStorage.connected_users_array = {};
                    usersArray.map(({host, begin_at, user, id}) => {
                        const pool = inPool.includes(user.login);
                        if (pool) {
                            inPoolNbr += 1;
                        }
                        self.globalStorage.connected_users_array[host] = {
                            begin_at: begin_at,
                            user: user,
                            id: id,
                            pool
                        };
                    });
                    self.globalStorage.connected_users_last_request = Date.now();
                    self.globalStorage.nb_connected_users = nb_connected_users;
                    self.globalStorage.inPoolNbr = inPoolNbr;
                    if (usersArray.length > 0) {
                        resolve({
                            nb_connected_users: self.globalStorage.nb_connected_users,
                            last_request: self.globalStorage.connected_users_last_request, 
                            array: self.globalStorage.connected_users_array,
                            inPoolNbr: self.globalStorage.inPoolNbr
                        });
                    }
                    else {
                        reject("can't get connected users");
                    }        
                }
            }());
        });
    }             
}

module.exports = Users;
    