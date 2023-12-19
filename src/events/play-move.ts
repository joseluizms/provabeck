import Joi from 'joi';
import { EventProps } from '.';
import terminalColors from '../utils/terminalColors';
import verifyVictory from '../utils/verifyVictory';

interface DataRequest {
  roomId: string;
  moveIndex: number;
}

export default {
  name: 'play-move',
  execute: ({
    socket,
    dataUnformatted,
    env,
    socketServer
  }: EventProps) => {

    const schema = Joi.object({
      roomId: Joi.string().required(),
      moveIndex: Joi.number().min(0).max(8).strict().required()
    });
    const isValidSchema = schema.validate(dataUnformatted);
    if(isValidSchema.error) {
      socket.emit('error', { message: 'Unable to play-move, data is invalid' });
      return;
    }
    const data: DataRequest = dataUnformatted;
    
    const roomExists = env.rooms.find(room => room.id===data.roomId);
    if(!roomExists) return;

    let isGameFinished = false;
    env.rooms = env.rooms.map(room => {
      if(room.id!==data.roomId) return room;
      if(room.lastMove===socket.id) {
        socket.emit('error', { message: 'Não é seu turno' });
        return room;
      }
      let movesWithLastMove = [...room.moves];
      movesWithLastMove[data.moveIndex] = socket.id;
      const isVictory = verifyVictory(movesWithLastMove, socket.id);

      let opponentId = room.players.filter(player => player!==socket.id)[0];
      let playerData = env.players.filter(player => player.id===socket.id)[0];
      let opponent = socketServer.sockets.sockets.get(opponentId);
      if(!opponent) return room;
      const roomUpdated = {
        ...room,
        moves: movesWithLastMove,
        lastMove: socket.id
      }

      console.log(`[${terminalColors.fg.cyan}Player ${terminalColors.fg.yellow}${socket.id}${terminalColors.fg.cyan} move${terminalColors.reset}] ->`, roomUpdated);
      
      if(isVictory) {
        isGameFinished = isVictory;
        opponent.emit('opponent-win', { room: roomUpdated, opponent: playerData });
        socket.emit('you-win', { room: roomUpdated });
        console.log(`[${terminalColors.fg.yellow}Player ${terminalColors.fg.cyan}${socket.id} ${terminalColors.fg.yellow}win${terminalColors.reset}] ->`, roomUpdated);
      } else {
        opponent.emit('move-update', { room: roomUpdated });
        socket.emit('move-update', { room: roomUpdated });
      }
      
      return roomUpdated;
    });

    if(isGameFinished)
      env.rooms = env.rooms.filter(room => room.id!==data.roomId);

  }
}