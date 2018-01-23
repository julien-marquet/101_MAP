const fetch = require("node-fetch");

const loop_queue = i_queue => {
    setInterval(()=> {
        clear_queue(i_queue.get_head());
    }, 2000);
};

function clear_queue(request) {
    if (request !== null) {
        fetch(request.request_content.url,  {
            headers: {
                ...request.request_content.headers
            }
        })
            .then(response => request.promise.resolve(response.json()))
            .catch(error => request.promise.reject(error));
    }
}

module.exports = loop_queue;