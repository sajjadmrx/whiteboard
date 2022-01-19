"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.deleteRoom = exports.deleteUserRoom = exports.getUser = exports.getRoom = exports.getUsers = exports.getRooms = exports.users = exports.rooms = void 0;
exports.rooms = [];
exports.users = [];
function getRooms() {
    return exports.rooms;
}
exports.getRooms = getRooms;
function getUsers() {
    return exports.users;
}
exports.getUsers = getUsers;
function getRoom(roomId) {
    return exports.rooms.find((room) => room.roomId == roomId);
}
exports.getRoom = getRoom;
function getUser(socketId, roomId) {
    return exports.users.find((user) => user.socketId == socketId && roomId == roomId);
}
exports.getUser = getUser;
function deleteUserRoom(socketId, roomId) {
    exports.users = exports.users.filter((user) => user.socketId != socketId && roomId != roomId);
    console.log(exports.users);
}
exports.deleteUserRoom = deleteUserRoom;
function deleteRoom(roomId) {
    exports.rooms = exports.rooms.filter((room) => room.roomId != roomId);
}
exports.deleteRoom = deleteRoom;
function deleteUser(socketId) {
    exports.users = exports.users.filter((user) => user.socketId != socketId);
}
exports.deleteUser = deleteUser;
