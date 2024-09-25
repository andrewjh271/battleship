import gameBoardFactory from '../src/gameboard';

let gameBoard;
beforeEach(() => {
  gameBoard = gameBoardFactory();
});

describe('initialization', () => {
  test('initializes with 100 objects', () => {
    expect(gameBoard.squares[8][9]).toBeInstanceOf(Object);
    expect(gameBoard.squares[1][10]).toBeUndefined();
  });
});

describe('placeShip', () => {
  test('places ship given coordinates', () => {
    gameBoard.placeShip([
      [0, 3],
      [0, 4],
      [0, 5],
      [0, 6],
    ]);
    const { ship } = gameBoard.squares[0][3];
    expect(gameBoard.squares[0][4].ship).toBe(ship);
  });

  test('placed ships can have names', () => {
    gameBoard.placeShip(
      [
        [3, 4],
        [4, 4],
      ],
      'Destroyer'
    );
    expect(gameBoard.squares[4][4].ship.name).toBe('Destroyer');
  });

  test('will not place a ship onto another ship', () => {
    gameBoard.placeShip([
      [1, 2],
      [2, 2],
      [3, 2],
    ]);
    expect(() =>
      gameBoard.placeShip([
        [2, 3],
        [2, 2],
      ])
    ).toThrow('Ships cannot be on top of ships');
  });

  test('will not place a ship off the board', () => {
    expect(() =>
      gameBoard.placeShip([
        [8, 9],
        [8, 10],
      ])
    ).toThrow('Ships cannot be placed off the board');
  });
});

describe('receive attack', () => {
  test('cannot attack the same square twice', () => {
    gameBoard.receiveAttack([2, 3]);
    gameBoard.receiveAttack([3, 4]);
    gameBoard.receiveAttack([8, 9]);
    expect(() => gameBoard.receiveAttack([2, 3])).toThrow('this square has already been attacked');
  });

  test('can sink a ship', () => {
    gameBoard.placeShip([
      [1, 2],
      [2, 2],
      [3, 2],
    ]);
    const { ship } = gameBoard.squares[2][2];
    gameBoard.receiveAttack([1, 2]);
    gameBoard.receiveAttack([2, 2]);
    expect(ship.isSunk()).toBe(false);
    gameBoard.receiveAttack([3, 2]);
    expect(ship.isSunk()).toBe(true);
  });
});

describe('gameOver', () => {
  test('reports whether all ships have sunk', () => {
    gameBoard.placeShip([
      [1, 2],
      [2, 2],
      [3, 2],
    ]);
    gameBoard.placeShip([
      [6, 6],
      [6, 9],
      [6, 8],
      [6, 7],
    ]);
    gameBoard.receiveAttack([1, 2]);
    gameBoard.receiveAttack([2, 2]);
    gameBoard.receiveAttack([3, 2]);
    expect(gameBoard.gameOver()).toBe(false);
    gameBoard.receiveAttack([6, 6]);
    gameBoard.receiveAttack([6, 9]);
    gameBoard.receiveAttack([6, 8]);
    gameBoard.receiveAttack([6, 7]);
    expect(gameBoard.gameOver()).toBe(true);
  });
});
