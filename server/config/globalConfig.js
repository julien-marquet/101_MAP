module.exports = {
    apiEndpoint: "https://api.intra.42.fr/",
    serverPort: 8080,
    clientPath: "/../public/",
    connectedUsers_loopRate: 30, // seconds
    queue_loopRate: 0.6, // seconds
    connectedUsers_cacheExpiration: 20, // minutes
    redirect_uri: "http://localhost:3000/",
    streamLogToConsole: true
};
