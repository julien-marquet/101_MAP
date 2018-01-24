const fetch = require("node-fetch");

const loop_queue = (get_head, decrease, getStatus) => {
    let requestNbr = 0;
    let request = get_head();
    if (request !== null) {
        clear_queue(request);
        request = get_head();
        requestNbr += 1;
        if (request !== null) {
            clear_queue(request);
            requestNbr += 1;
        }
    }
    setTimeout(() => {
        while (requestNbr != 0) {
            decrease();
            requestNbr -= 1;
        }
        if (getStatus() > 0) {
            loop_queue(get_head, decrease, getStatus);
        }
    }, 1000);
};

function clear_queue(request) {
    const options = {
        headers: {
            ...request.request_content.headers,
            "Content-Type": "application/json"
        },
        method: request.request_content.method || "GET",
        body: JSON.stringify(request.request_content.body) || {}
    };
    fetch(request.request_content.url, options)
        .then(response => request.promise.resolve(response.json()))
        .catch(error => request.promise.reject(error));
}

module.exports = loop_queue;