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
        const inPool = ["ledebut", "asag", "fakl", "rnoc", "vhuc", "ygok", "dcoat", "kanne", "mchey", "vcher", "vfoex", "afalco", "amorin", "aradix", "bperez", "btriki", "dakgul", "dbolut", "etoker", "frseve", "jsabot", "kpesci", "lnieto", "mrevol", "njouve", "nsalle", "ntahar", "rcepre", "widrye", "wsayad", "xjanin", "aganoun", "awonkam", "bjuarez", "bmuller", "dmboule", "dypayen", "faneyer", "fcordon", "fdufour", "flfinet", "glandre", "glucien", "gszpiro", "gveloso", "humoyne", "husahuc", "ivrosic", "jalucas", "jmanevy", "jromero", "kgardie", "lfragne", "lgirerd", "manquez", "matheme", "mbogard", "mforler", "mintran", "mmarcon", "nangelo", "nnieddu", "ocrossi", "qmercey", "rfanjas", "sbedene", "sducamp", "skeller", "swdenis", "tthuret", "vsamiez", "wmoulin", "yhattab", "aben-hal", "achappui", "acorblin", "afeldman", "alepercq", "amaadour", "aniervas", "antdelri", "arazanaj", "aubucher", "axegerve", "barey-ga", "bmokrani", "boeuvrar", "brey-gal", "brirouil", "bsoleill", "cdeschen", "clchauvi", "conrodri", "cscialpi", "davfelix", "ebourgeo", "echevali", "ehudeley", "einnocen", "elgrusko", "eschnell", "fcarrere", "fchancel", "fhenriet", "fleonard", "fllecocq", "ftourret", "gderramo", "gterrien", "hopoutea", "hutorres", "idmessao", "jbenassa", "jbenzegh", "jbuisson", "jcarrill", "jclerqui", "jde-la-m", "jde-mour", "jeangran", "jehechav", "jfouquet", "jfrankow", "jgraindo", "jlaurair", "jleuenbe", "jlhotell", "jofiguer", "jominodi", "jopailla", "juliemar", "kabouama", "kel-akio", "krambono", "ksouza-s", "lernault", "lfouilla", "lhasenfr", "loatilem", "loiberti", "losainra", "lverdeci", "maberkan", "maboisso", "macaudet", "madurand", "magnelli", "maparici", "mbartels", "mdelarbr", "mhotting", "mhouppin", "midiallo", "mjalenqu", "mlecieux", "mnaccach", "moghomra", "moudmine", "mweingae", "naplouvi", "nboufeld", "nhoffste", "nrivoire", "oshklyar", "paujulli", "pbarriol", "pitirard", "pmaucote", "pstoraci", "qmonmous", "rcabotia", "rchaddou", "rcodazzi", "rlegendr", "sachenin", "schekiro", "shechaic", "shorwood", "sifouche", "slunetta", "smainfro", "ssoubeir", "tbollach", "tclerc-p", "tdautrem", "thdos-sa", "thfelpin", "thfiessi", "tiperoul", "tmalzieu", "tmezouri", "tomberna", "tprzybyl", "tvarnier", "vasalome", "vascelli", "vbenedet", "vde-sain", "vdesmons", "vicaster", "videloff", "yalabidi", "ycorvais", "ylapiquo", "yvmartor", "yyacouba", "zseignon", "ztrouill"];
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
    