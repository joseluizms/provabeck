export interface IRoom {
  id: string;
  playerXId?: string;
  playerOId?: string;
  players: string[];
  moves: string[];
  lastMove?: string;
}