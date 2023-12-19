import socketIo, { Socket } from 'socket.io';
import { IEnvironment } from '../@types/Environment';

export interface EventProps {
  socket: Socket;
  env: IEnvironment;
  dataUnformatted: any;
  socketServer: socketIo.Server;
}