/* eslint-disable no-param-reassign */
import shipFactory from './ship';
import { find1DSets } from './1DSetFinder';
import { find2DSets } from './2DSetFinder';
import { getShipData } from './DOMAdapter';
import { on, off, emit } from './observer';
import { rowLength } from './boardSize';
import { getEnsemble } from './ensemble';
import unresolvedShipList from './unresolvedShips';
import { getAdjacentSquares } from './shipPlacement';

export default function boardFactory(id) {
  let totalShips = 0;
  let shipsSunk = 0;
  let totalHits = 0;
  let totalSunkHits = 0;
  let maxSharedEdges = Infinity;
  const placedShips = [];
  const squares = [];
  const remainingShips = { ...getEnsemble() };
  const unresolvedShips = unresolvedShipList();
  for (let i = 0; i < rowLength(); i++) {
    squares[i] = [];
    for (let j = 0; j < rowLength(); j++) {
      squares[i][j] = {};
    }
  }

  function resetSetup() {
    totalShips = 0;
    placedShips.length = 0; // reassigning placedShips to [] messes up reference
    for (let i = 0; i < rowLength(); i++) {
      for (let j = 0; j < rowLength(); j++) {
        delete squares[i][j].ship; // reassigning squares[i][j] to {} similarly causes bugs
      }
    }
  }

  let boundSetPosition;
  function listenForPosition() {
    boundSetPosition = setPosition.bind(this);
    on('setPosition', boundSetPosition); // board listens for setup onto the DOMBoard to be finalized
    on('clearPosition', resetSetup); // autoSetup() relies on adding ships to the board object, not just the DOMBoard
  }

  function setPosition(DOMBoard) {
    off('setPosition', boundSetPosition);
    off('clearPosition', resetSetup);
    if (placedShips.length > 0) return; // if there are placedShips, autoSetup() has been called and the data already exists in board object

    const ships = getShipData(DOMBoard);
    Object.entries(ships).forEach((ship) => {
      this.placeShip(ship[1], ship[0]);
    });
  }

  const isOccupied = (coordsSet) => {
    for (let i = 0; i < coordsSet.length; i++) {
      const coords = coordsSet[i];
      if (squares[coords[0]][coords[1]].ship) return true;
    }
    return false;
  };

  const isAttacked = (coords) => squares[coords[0]][coords[1]].attacked;

  const containsAttack = (coordsSet) => {
    for (let i = 0; i < coordsSet.length; i++) {
      const coords = coordsSet[i];
      const square = squares[coords[0]][coords[1]];
      if (square.attacked) return true;
    }
    return false;
  };

  const sharedEdgeCount = () => {
    let count = 0;
    placedShips.forEach((ship) => {
      ship.coords.forEach((coordPair) => {
        getAdjacentSquares(coordPair).forEach((adj) => {
          if (squares[adj[0]][adj[1]].ship && squares[adj[0]][adj[1]].ship.name !== ship.name) {
            count++;
          }
        });
      });
    });
    return count / 2;
  };

  const willExceedMaxSharedEdges = (coordsSet) => {
    placeShip(coordsSet, 'testPlacement');
    const result = sharedEdgeCount() > maxSharedEdges;
    unplaceLastShip();
    return result;
  };

  const containsMissOrSunkSquare = (coordsSet) => {
    for (let i = 0; i < coordsSet.length; i++) {
      const coords = coordsSet[i];
      const square = squares[coords[0]][coords[1]];
      if ((square.attacked && !square.ship) || square.sunk) return true;
      // the engine uses this function for finding moves, and while it should not necessarily know
      // whether a square contains a ship, it does know about misses (i.e. an attacked square with
      // no ship). it also does not necessarily know all squares that contain sunk ships, but can
      // often deduce them by marking hit squares as sunk when there are no unresolved hits
    }
    return false;
  };

  const numAttacksInSet = (coordsSet) => {
    let attacks = 0;
    for (let i = 0; i < coordsSet.length; i++) {
      const coords = coordsSet[i];
      const square = squares[coords[0]][coords[1]];
      if (square.attacked) attacks++;
    }
    return attacks;
  };

  const hasUnresolvedHits = () => totalHits > totalSunkHits;

  const outOfRange = (coords) => coords.flat().some((coord) => coord < 0 || coord > rowLength() - 1);

  function placeShip(coords, name) {
    if (outOfRange(coords)) throw new Error('Ships cannot be placed off the board');
    if (isOccupied(coords)) throw new Error('Ships cannot be on top of ships');

    const newShip = shipFactory(coords.length, name, coords);
    coords.forEach((coord) => {
      squares[coord[0]][coord[1]].ship = newShip;
    });
    totalShips++;
    placedShips.push(newShip);
  }

  function unplaceLastShip() {
    const { coords } = placedShips.pop();
    coords.forEach((coord) => {
      delete squares[coord[0]][coord[1]].ship;
    });
    totalShips--;
  }

  function setMaxSharedEdges(n) {
    maxSharedEdges = n;
  }

  on('attack', receiveAttack);

  function receiveAttack(attackData) {
    if (attackData.id !== id) return;

    const { coords } = attackData;
    const square = squares[coords[0]][coords[1]];
    if (square.attacked) throw new Error('this square has already been attacked');
    square.attacked = true;
    if (square.ship) {
      square.ship.hit();
      totalHits++;
      if (square.ship.isSunk()) {
        handleSinkEvent(this, square);
      } else {
        emit('hit');
      }
    } else {
      emit('miss');
    }
    emit('boardChange', { squares, id });
  }

  function handleSinkEvent(board, square) {
    shipsSunk++;
    totalSunkHits += square.ship.area;
    delete remainingShips[square.ship.name];
    emit('sunk', { id, inst: square.ship.name });
    square.sunkInstrument = square.ship.name;

    if (!board) return; // attack from DOM interaction to Observer — `this` in receieveAttack is undefined
    // `this` is defined if called from computer — that's when marking squares is necessary for algorithm

    if (hasUnresolvedHits()) {
      square.sunk = true;
      unresolvedShips.add(square.ship);
      unresolvedShips.resolve(board);
    } else {
      unresolvedShips.clear();
      markSunkSquares();
    }
  }

  function markSunkSquares() {
    for (let i = 0; i < rowLength(); i++) {
      for (let j = 0; j < rowLength(); j++) {
        if (squares[i][j].attacked) {
          squares[i][j].sunk = true;
        }
      }
    }
  }

  function allShipsSunk() {
    return totalShips === shipsSunk;
  }

  // find1DSets is a faster algorithm for finding sets with width or length equal to 1
  function findSets(conditionFunction, x, y) {
    if (x === 1 || y === 1) {
      const length = x === 1 ? y : x;
      return find1DSets(this, length, conditionFunction);
    }
    return find2DSets(this, x, y, conditionFunction);
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
    containsMissOrSunkSquare,
    containsAttack,
    isAttacked,
    numAttacksInSet,
    placeShip,
    receiveAttack,
    allShipsSunk,
    emptySquares,
    listenForPosition,
    resetSetup,
    hasUnresolvedHits,
    sharedEdgeCount,
    setMaxSharedEdges,
    willExceedMaxSharedEdges,
    remainingShips,
    placedShips,
    squares,
    id,
    get size() {
      return squares.length;
    },
  };
}
