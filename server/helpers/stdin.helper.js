
module.exports = {
    treateCommand: (text, sockets) => {
        if (text.trim() === "refresh") {
            sockets.emit("page.refresh");
        }
    }
};
