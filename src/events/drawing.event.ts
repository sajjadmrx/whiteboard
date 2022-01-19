
import { Server, Socket } from "socket.io";



class drawing {
  static eventName = 'drawing';
  static enabled = true;

  data: any
  constructor(public io: Server, public socket: Socket, ...args: any) {
    this.data = args[0];
    this.run();
  }

  async run(): Promise<void> {
    this.socket.broadcast.emit('drawing', this.data);
  }

}

export default drawing;