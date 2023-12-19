import Joi from 'joi';
import { EventProps } from '.';
import terminalColors from '../utils/terminalColors';

interface DataRequest {
  roomId: string;
}

export default {
  name: 'remove-room',
  execute: ({
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
      socket.emit('error', { message: 'Unable to remove-rooms, data is invalid' });
      return;
    }
    const data: DataRequest = dataUnformatted;

    env.rooms = env.rooms.filter(room => {
      if(room.id!==data.roomId) 
        return room;
      else {
        console.log(`[${terminalColors.fg.red}Room removed by ${terminalColors.fg.yellow}${socket.id}${terminalColors.reset}] ->`, data.roomId);
        return false;
      }
    });
    
    socket.emit('room-removed');

    socketServer.sockets.emit('update-rooms', { rooms: env.rooms.filter(r => r.players.length<2) });
  }
}