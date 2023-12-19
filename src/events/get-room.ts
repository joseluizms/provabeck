import Joi from 'joi';
import { EventProps } from '.';

interface DataRequest {
  roomId: string;
}

export default {
  name: 'get-room',
  execute: ({
    socket,
    dataUnformatted,
    env
  }: EventProps) => {

    const schema = Joi.object({
      roomId: Joi.string().required()
    });
    const isValidSchema = schema.validate(dataUnformatted);
    if(isValidSchema.error) {
      socket.emit('error', { message: 'Unable to get-room, data is invalid' });
      return;
    }
    const data: DataRequest = dataUnformatted;
    
    const playerData = env.players.find(player => player.id===socket.id);
    const room = env.rooms.find(room => room.id===data.roomId);
    if(!room) return;
    const opponentData = env.players.find(player => player.id===room.players.filter(player => player!==socket.id)[0]);

    socket.emit('get-room-response', {
      room,
      player: playerData,
      opponent: opponentData
    });

  }
}