module.exports = {
    apiEndpoint: "https://api.intra.42.fr/",
    serverPort: 8080,
    clientPath: "/../public/",
    connectedUsers_loopRate: 30, // seconds
    flushSocketCache_loopRate: 30,
    requestsBySecond: 2, // In queue
    connectedUsers_cacheExpiration: 10, // minutes
    redirect_uri: "http://localhost:3000/",
    streamLogToConsole: true
};
