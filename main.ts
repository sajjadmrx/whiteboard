import express, { Request, Response, NextFunction } from 'express';
import { Server, Socket } from "socket.io";

import http from 'http';
// import { v4 as uuidv4 } from 'uuid';
const PORT = process.env.PORT || 3000;


const app: express.Application = express();

const server = http.createServer(app);



app.use(express.static(__dirname + '/public'));

const io = new Server(server);



io.on('connection', (socket: Socket) => {
  console.log('client connected');


  socket.on('disconnect', () => {
    console.log('Client disconnected');
  })



})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})




