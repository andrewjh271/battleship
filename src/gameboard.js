import shipFactory from './ship';

export default function gameBoardFactory() {
  let totalShips = 0;
  let shipsSunk = 0;
  const squares = [];
  for (let i = 0; i < 10; i++) {
    squares[i] = [];
    for (let j = 0; j < 10; j++) {
      squares[i][j] = squareFactory();
    }
  }

  const placeShip = (coords, name) => {
    if (outOfRange(coords)) throw new Error('Ships cannot be placed off the board');
    if (isOccupied(coords)) throw new Error('Ships cannot be on top of ships');
    if (!inLine(coords))
      throw new Error(
        'Ships must be placed vertically or horizontally in an unbroken line'
      );

    const newShip = shipFactory(coords.length, name);
    coords.forEach((coord) => (squares[coord[0]][coord[1]].ship = newShip));
    totalShips++;
  };

  const isOccupied = (coords) => {
    for (let i = 0; i < coords.length; i++) {
      const coord = coords[i];
      if (squares[coord[0]][coord[1]].ship) return true;
    }
    return false;
  };

  const outOfRange = (coords) => {
    return coords.flat().some((coord) => coord < 0 || coord > 9);
  };

  const inLine = (coords) => {
    if (coords.every((coord) => coord[0] === coords[0][0])) {
      // horizontal
      coords.sort((a, b) => a[1] - b[1]);
      return coords.every(
        (coord, index) => index === 0 || Math.abs(coord[1] - coords[index - 1][1]) === 1
      );
    } else if (coords.every((coord) => coord[1] === coords[0][1])) {
      // vertical
      coords.sort((a, b) => a[0] - b[0]);
      return coords.every(
        (coord, index) => index === 0 || Math.abs(coord[0] - coords[index - 1][0]) === 1
      );
    }
    return false;
  };

  function receiveAttack(coords) {
    const square = squares[coords[0]][coords[1]];
    if (square.attacked) throw new Error('this square has already been attacked');
    if (square.ship) {
      square.ship.hit();
      if (square.ship.isSunk()) shipsSunk++;
    }
    square.attacked = true;
  }

  function gameOver() {
    return totalShips === shipsSunk;
  }

  function findSets(length) {
    if (length === 1) return emptySquares();
    let sets = [];
    for (let i = 0; i < squares.length; i++) {
      const horizontal = [];
      const vertical = [];
      for (let j = 0; j < squares.length; j++) {
        horizontal.push([j, i]);
        vertical.push([i, j]);
      }
      sets = [
        ...sets,
        ...findSetsFromRow(horizontal, length),
        ...findSetsFromRow(vertical, length),
      ];
    }
    return sets;
  }

  function findSetsFromRow(row, length) {
    let lft = 0;
    let rt = 1;
    const sets = [];

    while (rt < row.length) {
      if (squares[row[lft][0]][row[lft][1]].ship) {
        lft = rt;
        rt = rt + 1;
      } else if (squares[row[rt][0]][row[rt][1]].ship) {
        lft = rt + 1;
        rt = rt + 2;
      } else {
        if (rt - lft + 1 === length) {
          const set = [];
          for (let j = lft; j <= rt; j++) {
            set.push(row[j]);
          }
          sets.push(set);
          lft++;
          rt++;
        } else {
          rt++;
        }
      }
    }
    return sets;
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

  return { squares, placeShip, receiveAttack, gameOver, findSets };
}

function squareFactory() {
  let ship;
  let attacked = false;
  return { ship, attacked };
}
