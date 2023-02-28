function playerFactory(homeBoard, opponentBoard) {
  function attack(coords) {
    opponentBoard.receiveAttack(coords);
  }

  function placeShip(coords) {
    homeBoard.placeShip(coords);
  }

  return { attack, placeShip };
}

function computerFactory(homeBoard, opponentBoard) {
  const { placeShip } = playerFactory(homeBoard);
  const size = 10;
  const possibleMoves = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      possibleMoves.push([i, j]);
    }
  }

  function attack() {
    if (possibleMoves.length == 0) throw new Error('there are no moves left');
    const index = Math.floor(Math.random() * possibleMoves.length);
    const move = possibleMoves[index];
    possibleMoves[index] = [possibleMoves.length - 1];
    possibleMoves.pop();
    opponentBoard.receiveAttack(move);
  }

  return { attack, placeShip }
}

export { playerFactory, computerFactory };
