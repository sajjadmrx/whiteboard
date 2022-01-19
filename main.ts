import express, { Request, Response, NextFunction } from 'express';
import { Server, Socket } from "socket.io";

import http from 'http';
import { v4 as uuidv4 } from 'uuid';



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
interface IUSER {
  roomId: string;
  username: string;
  socketId: string;
}

const rooms: string[] = [];
const users: IUSER[] = [];

app.use(express.static(__dirname + '/public'));
// set ejs
app.set('view engine', 'ejs');


app.get('/', (req: Request, res: Response) => {
  const roomId = uuidv4();
  rooms.push('roomId', roomId);
  res.redirect(`/${roomId}`);
});


app.get('/:room', async (req: Request, res: Response) => {
  const roomId = req.params.room;
  const room = rooms.find(room => room === roomId);

  if (!room)
    return res.redirect('/');

  const usersInRoom = users.filter(user => user.roomId === roomId);
  res.render('index', { roomId, usersInRoom });

});



io.on('connection', (socket: Socket) => {

  socket.on('join', (data: any) => {
    users.push({
      roomId: data.roomId,
      username: data.username,
      socketId: socket.id
    });

    socket.join(data.roomId);
    // socket.broadcast.emit('user-connected', data.username);
    // io.to(socket.id).emit('old-users', users);

    io.to(data.roomId).emit('user-connected', data);
  })

  socket.on('drawing', (data: IDrawingObject) => {
    // console.log(data);
    socket.broadcast.emit('drawing', data);
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  })



})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})




