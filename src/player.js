import { rowLength } from './boardSize';
import { getEnsemble, getEnsembleName } from './ensemble';
import { huntDistribution, targetDistribution, selectMove } from './engine';
import { containsNoEdge, containsMinorityEdges, getMaxAdjacentSquares } from './shipPlacement';
import { find2DSets } from './2DSetFinder';

function humanPlayerFactory(homeBoard, opponentBoard, homeDOMBoard, opponentDOMBoard, moveCounter) {
  const ships = getEnsemble();

  const size = rowLength();
  const ens = getEnsembleName();

  function setup() {
    homeDOMBoard.setupBoard();
    homeBoard.listenForPosition();
  }

  function setTurn() {
    opponentDOMBoard.setDefense();
    opponentDOMBoard.enable();
    homeDOMBoard.setOffense();
  }

  function autoSetupSimple() {
    homeBoard.resetSetup();
    Object.entries(ships).forEach((ship) => {
      const name = ship[0];
      const dimensions = ship[1];
      const set = homeBoard.findSets(homeBoard.isOccupied, ...dimensions);
      const coords = set[Math.floor(Math.random() * set.length)];
      homeBoard.placeShip(coords, name);
    });
    homeDOMBoard.placeSetImages(homeBoard);
  }

  function autoSetup() {
    if (
      ens === 'harp' ||
      (size === 7 && (ens === 'orchestra' || ens === 'strings' || ens === 'percussion'))
    ) {
      autoSetupSimple();
      return;
    }

    try {
      homeBoard.resetSetup();
      const max = getMaxAdjacentSquares(rowLength());
      homeBoard.setMaxSharedEdges(max);
      let conditionFunction;

      Object.entries(ships).forEach((ship) => {
        const name = ship[0];
        const [width, height] = ship[1];
        const random = Math.random();
        if (random <= 0.2 || (max < 2 && ens === 'chamber' && size === 7)) {
          conditionFunction = composeFunction(
            homeBoard.isOccupied,
            containsNoEdge,
            homeBoard.willExceedMaxSharedEdges
          );
        } else if (random <= 0.4) {
          conditionFunction = composeFunction(
            homeBoard.isOccupied,
            containsMinorityEdges,
            homeBoard.willExceedMaxSharedEdges
          );
        } else {
          conditionFunction = composeFunction(homeBoard.isOccupied, homeBoard.willExceedMaxSharedEdges);
        }

        const set = find2DSets(homeBoard, width, height, conditionFunction);
        const coords = set[Math.floor(Math.random() * set.length)];
        homeBoard.placeShip(coords, name);
      });
      homeDOMBoard.placeSetImages(homeBoard);
    } catch {
      autoSetup();
    }
  }

  function composeFunction(...functions) {
    return function conditionFunctions(coordsSet) {
      for (let i = 0; i < functions.length; i++) {
        if (functions[i](coordsSet)) return true;
      }
      return false;
    };
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
  const ens = getEnsembleName();
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

  function setupSimple() {
    Object.entries(ships).forEach((ship) => {
      const name = ship[0];
      const dimensions = ship[1];
      const set = homeBoard.findSets(homeBoard.isOccupied, ...dimensions);
      const coords = set[Math.floor(Math.random() * set.length)];
      homeBoard.placeShip(coords, name);
    });
    homeDOMBoard.placeSetImages(homeBoard);
  }

  function setup() {
    if (
      ens === 'harp' ||
      (size === 7 && (ens === 'orchestra' || ens === 'strings' || ens === 'percussion'))
    ) {
      setupSimple();
      return;
    }

    try {
      homeBoard.resetSetup();
      const max = getMaxAdjacentSquares(rowLength());
      homeBoard.setMaxSharedEdges(max);
      let conditionFunction;

      Object.entries(ships).forEach((ship) => {
        const name = ship[0];
        const [width, height] = ship[1];
        const random = Math.random();
        if (random <= 0.2 || (max < 2 && ens === 'chamber' && size === 7)) {
          conditionFunction = composeFunction(
            homeBoard.isOccupied,
            containsNoEdge,
            homeBoard.willExceedMaxSharedEdges
          );
        } else if (random <= 0.4) {
          conditionFunction = composeFunction(
            homeBoard.isOccupied,
            containsMinorityEdges,
            homeBoard.willExceedMaxSharedEdges
          );
        } else {
          conditionFunction = composeFunction(homeBoard.isOccupied, homeBoard.willExceedMaxSharedEdges);
        }

        const set = find2DSets(homeBoard, width, height, conditionFunction);
        const coords = set[Math.floor(Math.random() * set.length)];
        homeBoard.placeShip(coords, name);
      });
      homeDOMBoard.placeSetImages(homeBoard);
    } catch {
      console.log('setup failed... trying again');
      setup();
    }
  }

  function composeFunction(...functions) {
    return function conditionFunctions(coordsSet) {
      for (let i = 0; i < functions.length; i++) {
        if (functions[i](coordsSet)) return true;
      }
      return false;
    };
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
