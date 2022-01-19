"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const index_routes_1 = __importDefault(require("./index.routes"));
const PORT = parseInt(process.env.PORT) || 3000;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
class WhiteBoard {
    constructor(port) {
        this.port = port;
        server.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
            this.run();
            this.setConfig();
            this.setRoutes();
            this.socketIo();
        });
    }
    run() {
    }
    setConfig() {
        app.use(express_1.default.static(path_1.default.resolve('public')));
        app.set('view engine', 'ejs');
    }
    setRoutes() {
        app.use(index_routes_1.default);
    }
    socketIo() {
        io.on('connection', (socket) => {
            const pathEvents = __dirname + path_1.default.sep + 'events';
            const eventFiles = fs_1.default.readdirSync(pathEvents);
            for (const file of eventFiles) {
                const eventClass = require(pathEvents + path_1.default.sep + file).default;
                if (!eventClass.enabled)
                    return;
                socket.on(eventClass.eventName, (...args) => {
                    new eventClass(io, socket, ...args);
                });
            }
        });
    }
}
new WhiteBoard(PORT);
