import gameBoardFactory from '../src/gameBoard';

test('initializes with 100 Square objects', () => {
  const gameBoard = gameBoardFactory();
  expect(gameBoard.squares[8][9]).toBeInstanceOf(Object);
  expect(gameBoard.squares[0][4]).toHaveProperty('ship');
  expect(gameBoard.squares[1][10]).toBeUndefined();
});

describe('placeShip', () => {
  let gameBoard;
  beforeEach(() => gameBoard = gameBoardFactory());

  test('places ship given coordinates', () => {
    gameBoard.placeShip([
      [0, 3],
      [0, 4],
      [0, 5],
      [0, 6],
    ]);
    const ship = gameBoard.squares[0][3].ship;
    expect(gameBoard.squares[0][4].ship).toBe(ship);
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
  
  describe('ships must be placed vertically or horizontally in an unbroken line', () => {
    const msg = 'Ships must be placed vertically or horizontally in an unbroken line';
    test('ships must be placed vertically or horizontally', () => {
      expect(() =>
        gameBoard.placeShip([
          [2, 1],
          [3, 2],
        ])
      ).toThrow(msg);
    });
  
    test('horizontal ships cannot have gaps', () => {
      expect(() =>
        gameBoard.placeShip([
          [4, 3],
          [5, 3],
          [7, 3],
          [8, 3],
        ])
      ).toThrow(msg);
    });
  
    test('vertical ships also cannot have gaps', () => {
      expect(() => gameBoard.placeShip([[6, 3], [6, 4], [6, 6]]).toThrow(msg));
    })
  
    test('out of order horizontal coordinates are ok', () => {
      gameBoard.placeShip([[2, 2], [2, 5], [2, 4], [2, 3]]);
      const ship = gameBoard.squares[2][5].ship;
      expect(gameBoard.squares[2][3].ship).toBe(ship);
    })
  
    test('out of order vertical coordinates are ok', () => {
      gameBoard.placeShip([[9, 8], [9, 3], [9, 7], [9, 4], [9, 5], [9, 6]]);
      const ship = gameBoard.squares[9][3].ship;
      expect(gameBoard.squares[9][5].ship).toBe(ship);
    })
  });
})

