import { rowLength } from "./boardSize";
import { getEnsemble } from "./ensemble";

const ships = getEnsemble();

function humanPlayerFactory(homeBoard, opponentBoard, DOMBoard) {
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

  function setup() {
    DOMBoard.setupBoard();
    homeBoard.listenForPosition();
  }

  function isComputer() {
    return false;
  }

  return { attack, placeShip, isComputer, setup };
}

function computerPlayerFactory(homeBoard, opponentBoard, DOMBoard) {
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
    opponentBoard.receiveAttack(move);
  }

  function setup() {
    Object.entries(ships).forEach((ship) => {
      const name = ship[0];
      const dimensions = ship[1];
      const set = homeBoard.findSets(...dimensions);
      const coords = set[Math.floor(Math.random() * set.length)];
      homeBoard.placeShip(coords, name);
    });
    DOMBoard.placeSetImages(homeBoard);
  }

  return { attack, setup, isComputer };
}

export { humanPlayerFactory, computerPlayerFactory };
