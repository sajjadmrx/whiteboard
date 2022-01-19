import { Server, Socket } from "socket.io";



class disconnect {
  static eventName = 'disconnect';
  static enabled = true;


  constructor(public io: Server, public socket: Socket, ...args: any) {
    this.run();
  }

  async run(): Promise<void> {

  }

}
export default disconnect;