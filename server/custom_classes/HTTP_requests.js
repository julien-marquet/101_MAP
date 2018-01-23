const fetch = require("node-fetch");

class HTTP_requests {
    launchRequest(request) {
        fetch(request.request_content.url,  {
            headers: {
                ...request.request_content.headers
            }})
            .then(response => {
                request.request_promise.resolve(response.json());
            })
            .catch(error => {
                request.request_promise.reject(error);
            });
    }
}

module.exports = HTTP_requests;