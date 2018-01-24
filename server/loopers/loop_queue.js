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
    fetch(request.request_content.url,  {
        headers: {
            ...request.request_content.headers
        }
    })
        .then(response => request.promise.resolve(response.json()))
        .catch(error => request.promise.reject(error));
}

module.exports = loop_queue;