import boardFactory from '../src/board';
import { rowLength } from '../src/boardSize';

// adjusts for board size, but will fail for board sizes < 7x7
let board;
let validIndex;
let invalidIndex;
const id = 'board1';
beforeEach(() => {
  board = boardFactory(id);
  validIndex = rowLength() - 1;
  invalidIndex = rowLength();
});

describe('initialization', () => {
  test('initializes with 100 objects', () => {
    expect(board.squares[3][validIndex]).toBeInstanceOf(Object);
    expect(board.squares[1][invalidIndex]).toBeUndefined();
  });
});

describe('placeShip', () => {
  test('places ship given coordinates', () => {
    board.placeShip([
      [0, 3],
      [0, 4],
      [0, 5],
      [0, 6],
    ]);
    const { ship } = board.squares[0][3];
    expect(board.squares[0][4].ship).toBe(ship);
  });

  test('placed ships can have names', () => {
    board.placeShip(
      [
        [3, 4],
        [4, 4],
      ],
      'Destroyer'
    );
    expect(board.squares[4][4].ship.name).toBe('Destroyer');
  });

  test('will not place a ship onto another ship', () => {
    board.placeShip([
      [1, 2],
      [2, 2],
      [3, 2],
    ]);
    expect(() =>
      board.placeShip([
        [2, 3],
        [2, 2],
      ])
    ).toThrow('Ships cannot be on top of ships');
  });

  test('will not place a ship off the board', () => {
    expect(() =>
      board.placeShip([
        [8, validIndex],
        [8, invalidIndex],
      ])
    ).toThrow('Ships cannot be placed off the board');
  });
});

describe('receive attack', () => {
  test('cannot attack the same square twice', () => {
    board.receiveAttack({ id, coords: [2, 3] });
    board.receiveAttack({ id, coords: [3, 4] });
    board.receiveAttack({ id, coords: [5, 6] });
    expect(() => board.receiveAttack({ id, coords: [2, 3] })).toThrow(
      'this square has already been attacked'
    );
  });

  test('can sink a ship', () => {
    board.placeShip([
      [1, 2],
      [2, 2],
      [3, 2],
    ]);
    const { ship } = board.squares[2][2];
    board.receiveAttack({ id, coords: [1, 2] });
    board.receiveAttack({ id, coords: [2, 2] });
    expect(ship.isSunk()).toBe(false);
    board.receiveAttack({ id, coords: [3, 2] });
    expect(ship.isSunk()).toBe(true);
  });
});

describe('gameOver', () => {
  test('reports whether all ships have sunk', () => {
    board.placeShip([
      [1, 2],
      [2, 2],
      [3, 2],
    ]);
    board.placeShip([
      [6, 6],
      [6, 3],
      [6, 4],
      [6, 5],
    ]);
    board.receiveAttack({ id, coords: [1, 2] });
    board.receiveAttack({ id, coords: [2, 2] });
    board.receiveAttack({ id, coords: [3, 2] });
    expect(board.gameOver()).toBe(false);
    board.receiveAttack({ id, coords: [6, 6] });
    board.receiveAttack({ id, coords: [6, 3] });
    board.receiveAttack({ id, coords: [6, 4] });
    board.receiveAttack({ id, coords: [6, 5] });
    expect(board.gameOver()).toBe(true);
  });
});
