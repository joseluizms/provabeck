import createRoom from '../events/create-room';
import getRoom from '../events/get-room';
import getRooms from '../events/get-rooms';
import joinRoom from '../events/join-room';
import playMove from '../events/play-move';
import registerPlayer from '../events/register-player';
import removeRoom from '../events/remove-room';

export default [
  createRoom,
  getRoom,
  getRooms,
  joinRoom,
  playMove,
  registerPlayer,
  removeRoom
]