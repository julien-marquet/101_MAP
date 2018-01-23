class Queue {
    constructor(globalStorage) {
        this.globalStorage = globalStorage;
        this.globalStorage.queue = [/*
            request_name: String,
            request_content: Object,
            promise: Promise
        */];
    }
    push_tail(request_name, request_content = null) {
        return (new Promise((resolve, reject) => {
            this.globalStorage.queue.push({
                request_name,
                request_content,
                promise: {resolve, reject}
            });
        }));
    }
    push_head(request_name, request_content = null) {
        return (new Promise((resolve, reject) => {
            this.globalStorage.queue.unshift({
                request_name,
                request_content,
                promise: {resolve, reject}
            });
        }));
    }
    get_head() {
        return (this.globalStorage.queue.shift() || null);
    }
}

module.exports = Queue;