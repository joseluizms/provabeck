import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import http from 'http';
import socketIo from 'socket.io';

import terminalColors from './utils/terminalColors';
import eventsImports from './utils/eventsImport';

import { IPlayer } from './@types/Player';
import { IRoom } from './@types/Room';
import { Environment } from './@types/Environment';

let rooms: IRoom[] = [];
let players: IPlayer[] = [];

const environment = new Environment(rooms, players);

(async () => {
  try {

    const app = express();
    const PORT = process.env.PORT || 3333;

    const server = new http.Server(app);
    const socketServer = new socketIo.Server(server, {
      cors: {
        origin: '*'
      }
    });

    socketServer.on('connection', (socket) => {
      console.log(`[${terminalColors.fg.green}New Socket Connection${terminalColors.reset}] ->`,socket.id);

      socket.on('disconnect', () => {
        console.log(`[${terminalColors.fg.red}Socket Disconnected${terminalColors.reset}] ->`,socket.id);
        environment.players = environment.players.filter(p => p.id!==socket.id);
        
        let opponentSocketId = '';
        environment.rooms = environment.rooms.filter(room => {
          if(room.players.includes(socket.id)) {
            opponentSocketId = room.players.filter(p => p!==socket.id)[0];
            return false;
          } else {
            return true;
          }
        });
    
        if(opponentSocketId) {
          const opponentSocket = socketServer.sockets.sockets.get(opponentSocketId);
          if(opponentSocket)
            opponentSocket.emit('opponent-quit');
        }

        socketServer.sockets.emit('update-rooms', { rooms: environment.rooms.filter(r => r.players.length<2) } );
      });

      function readEvents() {
        for(let event of eventsImports) {
          socket.on(event.name, data => event.execute({
            socket,
            env: environment,
            dataUnformatted: data, 
            socketServer
          }));
        }
      }
      readEvents();
    });

    server.listen(PORT, () => {
      console.log(`\n[${terminalColors.fg.green}Server Running at ${terminalColors.fg.cyan}${PORT}${terminalColors.reset}]\n`);
    });

  } catch(err) {
    console.log(`[${terminalColors.fg.red}Server Initialization Error${terminalColors.reset}] ->`,err);
    process.exit(0);
  }
})();