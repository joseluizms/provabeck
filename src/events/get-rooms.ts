import { EventProps } from '.';

export default {
  name: 'get-rooms',
  execute: ({
    socket,
    env
  }: EventProps) => {
    socket.emit('get-rooms-response', { rooms: env.rooms.filter(r => r.players.length<2) });
  }
}