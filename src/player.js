function playerFactory(homeBoard, opponentBoard) {
  function attack(coords) {
    const coordinates = coords || getCoords();
    opponentBoard.receiveAttack(coordinates);
  }

  function getCoords() {
    // get coordinates from User/DOM
  }

  function placeShip(coords) {
    homeBoard.placeShip(coords);
  }

  function placeAllShips() {
    // while (remainingShips)
      // get name and coordinates of ship from User/DOM
      // placeShip
  }

  function isComputer() {
    return false;
  }

  return { attack, placeShip, isComputer };
}

function computerFactory(homeBoard, opponentBoard) {
  const ships = {
    'Carrier': 5,
    'Battleship': 4,
    'Destroyer': 3,
    'Submarine': 3,
    'Patrol Boat': 2
  }

  const size = 10;
  const possibleMoves = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      possibleMoves.push([i, j]);
    }
  }

  function isComputer() {
    return true;
  }

  function attack() {
    if (possibleMoves.length == 0) throw new Error('there are no moves left');
    const index = Math.floor(Math.random() * possibleMoves.length);
    const move = possibleMoves[index];
    possibleMoves[index] = [possibleMoves.length - 1];
    possibleMoves.pop();
    opponentBoard.receiveAttack(move);
  }

  function placeAllShips() {
    for (const ship in ships) {
      const name = ship;
      const length =  ships[ship];
      const set = homeBoard.findSets(length);
      const coords = set[Math.floor(Math.random() * set.length)];
      homeBoard.placeShip(coords, name);
    }
  }

  return { attack, placeAllShips, isComputer }
}

export { playerFactory, computerFactory };
