"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var http_1 = __importDefault(require("http"));
var socket_io_1 = __importDefault(require("socket.io"));
var constants_1 = require("./config/constants");
var app = express_1.default();
app.use(express_1.default.static(__dirname + "/client"));
var server = new http_1.default.Server(app);
var io = socket_io_1.default(server);
app.get('/', function (_req, res) {
    res.sendFile(path_1.default.resolve("./client/index.html"));
});
var users = [];
io.on("connect", function (socket) {
    console.log("a user connected");
    socket.on("username", function (username) {
        socket.username = username;
        users.push(username);
        console.log(username + " joined the game.");
        socket.emit("users", users.toString());
    });
    socket.on("start", function () {
        console.log("Starting game with " + users);
    });
    socket.on("disconnect", function () {
        var index = users.indexOf(socket.username);
        if (index > -1)
            users.splice(index, 1);
        console.log(socket.username + " left the game.");
    });
    // for testing purposes
    socket.on("echo", function (message) {
        socket.emit("echo", message);
    });
});
server.listen(constants_1.PORT, function () {
    console.log("Server is listening on port " + constants_1.PORT);
});
exports.close = function () { return server.close(); };
