import { Server, Socket } from "socket.io";
import * as db from "../db";


class disconnect {
  static eventName = 'disconnect';
  static enabled = true;


  constructor(public io: Server, public socket: Socket, ...args: any) {
    this.run();
  }

  async run(): Promise<void> {
    this.socket.broadcast.emit('left', this.socket.id);
    db.deleteUser(this.socket.id);


  }

}
export default disconnect;