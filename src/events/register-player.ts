import Joi from 'joi';
import { EventProps } from '.';
import terminalColors from '../utils/terminalColors';

interface DataRequest {
  playerName: string;
}

export default {
  name: 'register-player',
  execute: ({
    socket,
    dataUnformatted,
    env
  }: EventProps) => {
    
    const schema = Joi.object({
      playerName: Joi.string().required()
    });
    const isValidSchema = schema.validate(dataUnformatted);
    if(isValidSchema.error) {
      socket.emit('error', { message: 'Unable to register-player, data is invalid' });
      return;
    }
    const data: DataRequest = dataUnformatted;

    if(!data.playerName||typeof data.playerName!=='string') return;
    env.players.push({
      id: socket.id,
      name: data.playerName.trim()
    });
    console.log(`[${terminalColors.fg.cyan}Player Added to list${terminalColors.reset}] ->`,socket.id,'|',data.playerName);
    socket.emit('player-registered');
  }
}