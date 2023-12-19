import Joi from 'joi';
import { EventProps } from '.';
import terminalColors from '../utils/terminalColors';

interface DataRequest {
  roomId: string;
}

export default {
  name: 'join-room',
  execute: async ({
    socket,
    dataUnformatted,
    env,
    socketServer
  }: EventProps) => {

    const schema = Joi.object({
      roomId: Joi.string().required()
    });
    const isValidSchema = schema.validate(dataUnformatted);
    if(isValidSchema.error) {
      socket.emit('error', { message: 'Unable to join-room, data is invalid' });
      return;
    }
    const data: DataRequest = dataUnformatted;

    let opponentId = '';
    env.rooms = env.rooms.map(room => {
      if(room.id!==data.roomId) return room;
      console.log(`[${terminalColors.fg.green}Player ${terminalColors.fg.yellow}${socket.id} ${terminalColors.fg.green}joined in room${terminalColors.reset}] ->`, room.id);
      opponentId = room.players[0];
      return {
        ...room,
        playerOId: socket.id,
        players: [...room.players, socket.id]
      }
    });

    if(!opponentId) return;
    const opponent = socketServer.sockets.sockets.get(opponentId);
    if(!opponent) return;

    opponent.emit('game-started', { roomId: data.roomId });

    socket.emit('joined-room', { roomId: data.roomId });

    console.log(`[${terminalColors.fg.green}Game started${terminalColors.reset}] ->`, data.roomId);

    socketServer.sockets.emit('update-rooms', { rooms: env.rooms.filter(r => r.players.length<2) });
  }
}