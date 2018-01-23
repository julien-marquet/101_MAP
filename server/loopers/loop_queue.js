const HTTP_requests = require("../HTTP_requests");
const i_HTTP_requests = new HTTP_requests;

const loop_queue = (i_queue) => {
    setInterval(()=> {
        clear_queue(i_queue);
    }, 2000);
};

function clear_queue(i_queue) {
    const request = i_queue.get_head();
    if (request) {
        i_HTTP_requests.launchRequest(request);
    }
}

module.exports = loop_queue;