module.exports = {
  apiEndpoint: "https://api.intra.42.fr/",
  serverPort: 8080,
  clientPath: "/../public/",
  connectedUsers_loopRate: 30, // seconds
  requestsBySecond: 4, // In queue
  connectedUsers_cacheExpiration: 10, // minutes
  redirect_uri: "https://the-matrix.le-101.fr/",
  streamLogToConsole: true,
  blocId: 8
};
