/* eslint-disable no-param-reassign */
import { getEnsemble } from './ensemble';
import { find2DSets } from './2DSetFinder';

export default function unresolvedShipList() {
  let list = [];

  function resolve(board) {
    for (let i = 0; i < list.length; i++) {
      const { name } = list[i];
      const [width, height] = [...getEnsemble()[name]];
      const invalidPlacement = makeConditionFunction(board, name);
      const set = find2DSets(board, width, height, invalidPlacement);
      // find2DSets must be used because it can check that a set includes one square that meets a condition
      // find1DSets looks at each square individually for conditions that would disqualify a set

      if (set.length === 0) {
        throw new Error(`No possible sets found for ${name}`);
      } else if (set.length === 1) {
        markSunkSquares(board, set[0]);
        remove(name);
        resolve(board);
        break;
      }
    }
  }

  function markSunkSquares(board, set) {
    set.forEach((coords) => {
      board.squares[coords[0]][coords[1]].sunk = true;
    });
  }

  function makeConditionFunction(board, name) {
    return function conditionFunction(coordsSet) {
      if (
        !coordsSet.some((coords) => {
          const square = board.squares[coords[0]][coords[1]];
          return square.sunkInstrument === name;
        })
      ) {
        return true;
      }
      if (
        coordsSet.some((coords) => {
          const square = board.squares[coords[0]][coords[1]];
          return !square.attacked || (square.sunk && square.sunkInstrument !== name);
        })
      ) {
        return true;
      }

      return false;
    };
  }

  function add(ship) {
    // list is ordered from largest to smallest because larger instruments
    // are more likely to have only one possible placement
    for (let i = 0; i < list.length; i++) {
      if (ship.area > list[i].area) {
        list.splice(i, 0, ship);
        return;
      }
    }
    list.push(ship);
  }

  function remove(name) {
    for (let i = 0; i < list.length; i++) {
      if (name === list[i].name) {
        list.splice(i, 1);
        return;
      }
    }
    throw new Error('No instrument found to remove');
  }

  function clear() {
    list = [];
  }

  return {
    resolve,
    add,
    clear,
  };
}
