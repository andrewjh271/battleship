import shipFactory from './ship';
import { find1DSets } from './1DSetFinder';
import { find2DSets } from './2DSetFinder';
import { getShipData } from './DOMAdapter';
import { on, off, emit } from './observer';
import { rowLength } from './boardSize';

export default function boardFactory(id) {
  let totalShips = 0;
  let shipsSunk = 0;
  const placedShips = [];
  const squares = [];
  for (let i = 0; i < rowLength(); i++) {
    squares[i] = [];
    for (let j = 0; j < rowLength(); j++) {
      squares[i][j] = {};
    }
  }

  let boundSetPosition;
  function listenForPosition() {
    boundSetPosition = setPosition.bind(this);
    on('setPosition', boundSetPosition);
  }

  function setPosition(DOMBoard) {
    const ships = getShipData(DOMBoard);
    Object.entries(ships).forEach((ship) => {
      this.placeShip(ship[1], ship[0]);
    });
    off('setPosition', boundSetPosition);
  }

  const isOccupied = (coords) => {
    if (typeof coords[0] === 'number') {
      return !!squares[coords[0]][coords[1]].ship;
    }
    for (let i = 0; i < coords.length; i++) {
      const coord = coords[i];
      if (squares[coord[0]][coord[1]].ship) return true;
    }
    return false;
  };

  const outOfRange = (coords) =>
    coords.flat().some((coord) => coord < 0 || coord > rowLength() - 1);

  const placeShip = (coords, name) => {
    if (outOfRange(coords)) throw new Error('Ships cannot be placed off the board');
    if (isOccupied(coords)) throw new Error('Ships cannot be on top of ships');

    const newShip = shipFactory(coords.length, name, coords);
    coords.forEach((coord) => {
      squares[coord[0]][coord[1]].ship = newShip;
    });
    totalShips++;
    placedShips.push(newShip);
  };

  on('attack', receiveAttack);

  function receiveAttack(attackData) {
    if (attackData.id !== id) return;

    const { coords } = attackData;
    const square = squares[coords[0]][coords[1]];
    if (square.attacked) throw new Error('this square has already been attacked');
    if (square.ship) {
      square.ship.hit();
      if (square.ship.isSunk()) shipsSunk++;
    }
    square.attacked = true;
    emit('boardChange', { squares, id });
  }

  function gameOver() {
    return totalShips === shipsSunk;
  }

  // find1DSets is a faster algorithm for finding sets with width or length equal to 1
  function findSets(x, y = 1) {
    if (x === 1 || y === 1) {
      const length = x === 1 ? y : x;
      return find1DSets(this, length);
    }
    return find2DSets(this, x, y);
  }

  function emptySquares() {
    const set = [];
    for (let i = 0; i < squares.length; i++) {
      for (let j = 0; j < squares.length; j++) {
        if (!squares[i][j].ship) {
          set.push([i, j]);
        }
      }
    }
    return set;
  }

  return {
    findSets,
    isOccupied,
    placeShip,
    receiveAttack,
    gameOver,
    emptySquares,
    listenForPosition,
    placedShips,
    squares,
    id,
    get size() {
      return squares.length;
    },
  };
}
