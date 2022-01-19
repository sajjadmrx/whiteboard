import { IRoom } from "./interfaces/IRoom.interface";
import { IUSER } from "./interfaces/IUser.interface";

export let rooms: IRoom[] = [];
export let users: IUSER[] = [];


export function getRooms(): IRoom[] {
  return rooms;
}

export function getUsers(): IUSER[] {
  return users;
}

export function getRoom(roomId: string): IRoom | undefined {
  return rooms.find((room) => room.roomId == roomId);
}

export function getUser(socketId: string, roomId: string): IUSER | undefined {
  return users.find((user) => user.socketId == socketId && roomId == roomId);
}

export function deleteUserRoom(socketId: string, roomId: string) {
  users = users.filter((user) => user.socketId != socketId && roomId != roomId);
  console.log(users);
}
export function deleteRoom(roomId: string) {
  rooms = rooms.filter((room) => room.roomId != roomId);
}
export function deleteUser(socketId: string) {
  users = users.filter((user) => user.socketId != socketId);
}
