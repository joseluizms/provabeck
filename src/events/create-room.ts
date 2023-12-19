import { v4 as uuid } from 'uuid';
import { EventProps } from '.';
import terminalColors from '../utils/terminalColors';

export default {
  name: 'create-room',
  execute: ({
    socket,
    env,
    socketServer
  }: EventProps) => {

    for(const room of env.rooms) {
      if(room.players.includes(socket.id)) {
        socket.emit('error', { message: `Unable to create-room, already playing in ${room.id}` });
        return;
      }
    }

    const room = {
      id: uuid(),
      players: [socket.id],
      playerXId: socket.id,
      moves: ['','','','','','','','','']
    };
    env.rooms.push(room);
    console.log(`[${terminalColors.fg.green}Created room by ${terminalColors.fg.yellow}${socket.id}${terminalColors.reset}] ->`, room);
    socket.emit('room-created', { room });

    socketServer.sockets.emit('update-rooms', { rooms: env.rooms.filter(r => r.players.length<2) });
  }
}