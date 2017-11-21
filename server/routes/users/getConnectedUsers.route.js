const globalState = require('../../globalState'),
API_requests = require('../../api/API_requests');

const getConnectedUsers = router => {
  router.get('/getConnectedUsers', (req, res) => {
    API_requests.getConnectedUsers(9, success => {
      if (success)
        res.json(JSON.stringify(globalState.connected_users));
      else
        res.json({"error": true, "message": "unknown error"});
    });
  });
};

module.exports = getConnectedUsers;
