import { rowLength } from './boardSize';
import { getEnsemble } from './ensemble';
import { huntDistribution, targetDistribution, selectMove } from './engine';

function humanPlayerFactory(homeBoard, opponentBoard, homeDOMBoard, opponentDOMBoard, moveCounter) {
  const ships = getEnsemble();

  function setup() {
    homeDOMBoard.setupBoard();
    homeBoard.listenForPosition();
  }

  function setTurn() {
    opponentDOMBoard.setDefense();
    opponentDOMBoard.enable();
    homeDOMBoard.setOffense();
  }

  function autoSetup() {
    homeBoard.resetSetup();
    Object.entries(ships).forEach((ship) => {
      const name = ship[0];
      const dimensions = ship[1];
      const set = homeBoard.findSets(homeBoard.isOccupied, ...dimensions);
      const coords = set[Math.floor(Math.random() * set.length)];
      homeBoard.placeShip(coords, name);
    });
    homeDOMBoard.placeSetImages(homeBoard);
    homeBoard.unlistenForPosition();
    // ships have already been placed onto homeBoard — don't re-add them from DOMBoard
  }

  function isComputer() {
    return false;
  }

  function sunkAllShips() {
    return opponentBoard.allShipsSunk();
  }

  function incrementMoveCounter() {
    moveCounter.increment();
  }

  return { isComputer, setup, autoSetup, setTurn, sunkAllShips, incrementMoveCounter };
}

function computerPlayerFactory(homeBoard, opponentBoard, homeDOMBoard, moveCounter) {
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
    const distribution = opponentBoard.hasUnresolvedHits()
      ? targetDistribution(opponentBoard)
      : huntDistribution(opponentBoard);

    const move = selectMove(distribution);
    opponentBoard.receiveAttack({ id: opponentBoard.id, coords: move });
    moveCounter.increment();
  }

  function setup() {
    Object.entries(ships).forEach((ship) => {
      const name = ship[0];
      const dimensions = ship[1];
      const set = homeBoard.findSets(homeBoard.isOccupied, ...dimensions);
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
