import express, { Request, Response, NextFunction } from 'express';
import { Server, Socket } from "socket.io";

import http from 'http';
// import { v4 as uuidv4 } from 'uuid';
const PORT = process.env.PORT || 3000;


const app: express.Application = express();

const server = http.createServer(app);
const io = new Server(server);


// interfaces
interface IDrawingObject {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  color: string;
  username: string;
}




app.use(express.static(__dirname + '/public'));
io.on('connection', (socket: Socket) => {
  console.log('client connected');

  socket.on('drawing', (data: IDrawingObject) => {
    console.log(data);
    socket.broadcast.emit('drawing', data);
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  })



})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})




