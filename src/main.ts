import fs from 'fs'
import path from 'path'
import express, { Request, Response, NextFunction } from 'express';
import { Server, Socket } from "socket.io";
import http from 'http';
import { v4 as uuidv4 } from 'uuid';

import indexRoutes from './index.routes'




const PORT = parseInt(process.env.PORT as string) || 3000;


const app: express.Application = express();
const server = http.createServer(app);
const io = new Server(server);




class WhiteBoard {


  constructor(public port: number) {

    server.listen(this.port, () => {

      console.log(`Server is running on port ${this.port}`);
      this.run();
      this.setConfig();
      this.setRoutes();
      this.socketIo()

    })

  }

  run(): void {

  }

  setConfig(): void {

    app.use(express.static(path.resolve('public')))

    app.set('view engine', 'ejs');
  }

  setRoutes(): void {
    app.use(indexRoutes);
  }

  socketIo(): void {
    io.on('connection', (socket: Socket) => {
      const pathEvents = __dirname + path.sep + 'events';
      const eventFiles = fs.readdirSync(pathEvents);
      for (const file of eventFiles) {
        const eventClass = require(pathEvents + path.sep + file).default;
        if (!eventClass.enabled)
          return;

        socket.on(eventClass.eventName, (...args: any) => {
          new eventClass(io, socket, ...args)
        })

      }
    })

  }


}

new WhiteBoard(PORT);