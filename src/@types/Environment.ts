import { IPlayer } from './Player';
import { IRoom } from './Room';

export interface IEnvironment {
  rooms: IRoom[];
  players: IPlayer[];
}

export class Environment {
  constructor(
    public rooms: IRoom[],
    public players: IPlayer[]
  ) {}
}