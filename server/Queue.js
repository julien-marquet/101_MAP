const   Q = require("q");

class Queue {
    constructor(globalStorage) {
        this.globalStorage = globalStorage;
        this.globalStorage.queue = [/*
            request_name: String,
            request_content: Object,
            request_promise: Promise
        */];
    }
    push_tail(request_name, request_content = null) {
        const def = Q.defer();
        this.globalStorage.queue.push({
            request_name,
            request_content,
            request_promise: def
        });
        return def.promise;
    }
    push_head(request_name, request_content = null) {
        const def = Q.defer();
        this.globalStorage.queue.unshift({
            request_name,
            request_content,
            request_promise: def
        });
    }
    get_head() {
        return (this.globalStorage.queue.shift() || null);
    }
}

module.exports = Queue;