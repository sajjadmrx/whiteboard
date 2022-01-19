import express, { Request, Response, NextFunction, Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router: Router = express.Router();

import * as db from './db';

router.get('/', (req: Request, res: Response) => {
  const roomId = uuidv4();
  db.rooms.push({ roomId });
  console.log(db.rooms);
  res.redirect(`/${roomId}`);
});


router.get('/:room', async (req: Request, res: Response) => {
  const roomId = req.params.room;
  const room = db.rooms.find(room => room.roomId === roomId);

  if (!room)
    return res.redirect('/');

  const usersInRoom = db.users.filter(user => user.roomId === roomId);
  res.render('index', { roomId, usersInRoom });

});



export default router