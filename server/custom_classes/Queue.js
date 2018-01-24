const launchRequests = require("../loopers/loop_queue");

class Queue {
    constructor(globalStorage) {
        this.globalStorage = globalStorage;
        this.globalStorage.queue = {
            status: 0,
            content: [/*
            request_name: String,
            request_content: Object,
            promise: Promise
        */]};
    }

    launchQueue() {
        this.globalStorage.queue.status += 1;
        if (this.globalStorage.queue.status === 1) {
            launchRequests(this.get_head.bind(this), this.decreaseStatus.bind(this), this.getStatus.bind(this));
        }
    }

    getStatus() {
        return (this.globalStorage.queue.status);
    }

    decreaseStatus() {
        this.globalStorage.queue.status -= 1;
    }

    push_tail(request_name, request_content = null) {
        return (new Promise((resolve, reject) => {
            this.globalStorage.queue.content.push({
                request_name,
                request_content,
                promise: {resolve, reject}
            });
            this.launchQueue();
        }));
    }
    push_head(request_name, request_content = null) {
        return (new Promise((resolve, reject) => {
            this.globalStorage.queue.content.unshift({
                request_name,
                request_content,
                promise: {resolve, reject}
            });
            this.launchQueue();
        }));
    }
    get_head() {
        return (this.globalStorage.queue.content.shift() || null);
    }
}

module.exports = Queue;