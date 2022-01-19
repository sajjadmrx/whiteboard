import { Server, Socket } from "socket.io";
import * as db from "../db";



class JoinRoom {
  static eventName = 'joinRoom';
  static enabled = true;

  data: any;
  constructor(public io: Server, public socket: Socket, ...args: any) {
    this.data = args[0];
    this.run();
  }

  async run(): Promise<void> {
    db.users.push({
      roomId: this.data.roomId,
      username: this.data.username,
      socketId: this.socket.id
    });

    this.socket.join(this.data.roomId);
    this.data.socketId = this.socket.id;

    this.io.to(this.data.roomId).emit('user-connected', this.data);
  }

}

export default JoinRoom;