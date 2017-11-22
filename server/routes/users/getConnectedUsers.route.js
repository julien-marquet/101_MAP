const users_api = require('../../api/Users.api.js');
const Oauth2_authenticator = require('../../OAuth2_authenticator');

const getConnectedUsers = (router, globalStorage) => {
  const i_Oauth2_authenticator = new Oauth2_authenticator(globalStorage);
  const i_users_api = new users_api(globalStorage, i_Oauth2_authenticator);
  router.get('/getConnectedUsers', (req, res) => {
    i_users_api.getConnectedUsers(9, result => {
      if (result.success)
        res.json(JSON.stringify(result.content));
      else
        res.json({"error": true, "message": result.message});
    });
  });
};

module.exports = getConnectedUsers;
