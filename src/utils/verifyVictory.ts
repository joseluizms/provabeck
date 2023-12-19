export default function verifyVictory(moves: string[], playerId: string): boolean {
  const possibleWinMoves = [
    //columns
    [0,3,6],
    [1,4,7],
    [2,5,8],
    //rows
    [0,1,2],
    [3,4,5],
    [6,7,8],
    //diagonals
    [0,4,8],
    [2,4,6]
  ]
  let isVictory = false;
  for (let move of possibleWinMoves) {
    const movesFiltered = move.filter(index => moves[index] === playerId);
    if(movesFiltered.length === 3) {
      isVictory = true;
      break;
    }
  }
  return isVictory;
}