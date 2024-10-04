import { rowLength } from './boardSize';
import { getEnsemble } from './ensemble';

function humanPlayerFactory(homeBoard, opponentBoard, homeDOMBoard, opponentDOMBoard) {
  function setup() {
    homeDOMBoard.setupBoard();
    homeBoard.listenForPosition();
  }

  function setTurn() {
    opponentDOMBoard.setDefense();
    opponentDOMBoard.enable();
    homeDOMBoard.setOffense();
  }

  function isComputer() {
    return false;
  }

  function sunkAllShips() {
    return opponentBoard.allShipsSunk();
  }

  return { isComputer, setup, setTurn, sunkAllShips };
}

function computerPlayerFactory(homeBoard, opponentBoard, homeDOMBoard) {
  const ships = getEnsemble();
  const size = rowLength();
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
    if (possibleMoves.length === 0) throw new Error('there are no moves left');
    const index = Math.floor(Math.random() * possibleMoves.length);
    const move = possibleMoves[index];
    possibleMoves[index] = possibleMoves[possibleMoves.length - 1];
    possibleMoves.pop();
    opponentBoard.receiveAttack({ id: opponentBoard.id, coords: move });
  }

  function setup() {
    Object.entries(ships).forEach((ship) => {
      const name = ship[0];
      const dimensions = ship[1];
      const set = homeBoard.findSets(...dimensions);
      const coords = set[Math.floor(Math.random() * set.length)];
      homeBoard.placeShip(coords, name);
    });
    homeDOMBoard.placeSetImages(homeBoard);
  }

  function setTurn() {
    homeDOMBoard.disable();
  }

  function sunkAllShips() {
    return opponentBoard.allShipsSunk();
  }

  return { attack, setup, isComputer, setTurn, sunkAllShips };
}

export { humanPlayerFactory, computerPlayerFactory };
