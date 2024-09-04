import gameBoardFactory from '../src/gameboard';

let gameBoard;
beforeEach(() => (gameBoard = gameBoardFactory()));

describe('initialization', () => {
  test('initializes with 100 Square objects', () => {
    expect(gameBoard.squares[8][9]).toBeInstanceOf(Object);
    expect(gameBoard.squares[0][4]).toHaveProperty('ship');
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
    const ship = gameBoard.squares[0][3].ship;
    expect(gameBoard.squares[0][4].ship).toBe(ship);
  });

  test('placed ships can have names', () => {
    gameBoard.placeShip([[3, 4], [4, 4]], 'Destroyer');
    expect(gameBoard.squares[4][4].ship.name).toBe('Destroyer');
  })

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
      expect(() =>
        gameBoard
          .placeShip([
            [6, 3],
            [6, 4],
            [6, 6],
          ])
          .toThrow(msg)
      );
    });

    test('out of order horizontal coordinates are ok', () => {
      gameBoard.placeShip([
        [2, 2],
        [2, 5],
        [2, 4],
        [2, 3],
      ]);
      const ship = gameBoard.squares[2][5].ship;
      expect(gameBoard.squares[2][3].ship).toBe(ship);
    });

    test('out of order vertical coordinates are ok', () => {
      gameBoard.placeShip([
        [9, 8],
        [9, 3],
        [9, 7],
        [9, 4],
        [9, 5],
        [9, 6],
      ]);
      const ship = gameBoard.squares[9][3].ship;
      expect(gameBoard.squares[9][5].ship).toBe(ship);
    });
  });
});

describe('receive attack', () => {
  test('cannot attack the same square twice', () => {
    gameBoard.receiveAttack([2, 3]);
    gameBoard.receiveAttack([3, 4]);
    gameBoard.receiveAttack([8, 9]);
    expect(() => gameBoard.receiveAttack([2, 3])).toThrow(
      'this square has already been attacked'
    );
  });

  test('can sink a ship', () => {
    gameBoard.placeShip([
      [1, 2],
      [2, 2],
      [3, 2],
    ]);
    const ship = gameBoard.squares[2][2].ship;
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

describe('randomly placing  ships', () => {
  test('findSets returns an array of all valid coordinates for ship of length n', () => {
    gameBoard.placeShip([
      [0, 5],
      [1, 5],
    ]);
    gameBoard.placeShip([
      [2, 3],
      [2, 4],
      [2, 5],
      [2, 6],
      [2, 7],
    ]);
    gameBoard.placeShip([
      [3, 0],
      [3, 1],
      [3, 2],
    ]);
    gameBoard.placeShip([
      [4, 7],
      [4, 8],
      [4, 9],
    ]);
    gameBoard.placeShip([
      [4, 2],
      [5, 2],
      [6, 2],
      [7, 2],
      [8, 2],
    ]);
    gameBoard.placeShip([
      [6, 0],
      [7, 0],
    ]);
    gameBoard.placeShip([
      [5, 4],
      [5, 5],
    ]);
    gameBoard.placeShip([
      [5, 6],
      [6, 6],
      [7, 6],
    ]);
    gameBoard.placeShip([
      [6, 8],
      [6, 9],
    ]);
    gameBoard.placeShip([
      [9, 3],
      [9, 4],
    ]);

    const expected = [
      [
        [4, 1],
        [5, 1],
        [6, 1],
        [7, 1],
        [8, 1],
      ],
      [
        [5, 1],
        [6, 1],
        [7, 1],
        [8, 1],
        [9, 1],
      ],
      [
        [3, 3],
        [4, 3],
        [5, 3],
        [6, 3],
        [7, 3],
      ],
      [
        [4, 3],
        [5, 3],
        [6, 3],
        [7, 3],
        [8, 3],
      ],
      [
        [5, 7],
        [6, 7],
        [7, 7],
        [8, 7],
        [9, 7],
      ],
      [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
        [1, 3],
        [1, 4],
      ],
      [
        [3, 3],
        [3, 4],
        [3, 5],
        [3, 6],
        [3, 7],
      ],
      [
        [3, 4],
        [3, 5],
        [3, 6],
        [3, 7],
        [3, 8],
      ],
      [
        [3, 5],
        [3, 6],
        [3, 7],
        [3, 8],
        [3, 9],
      ],
      [
        [8, 3],
        [8, 4],
        [8, 5],
        [8, 6],
        [8, 7],
      ],
      [
        [8, 4],
        [8, 5],
        [8, 6],
        [8, 7],
        [8, 8],
      ],
      [
        [8, 5],
        [8, 6],
        [8, 7],
        [8, 8],
        [8, 9],
      ],
      [
        [9, 5],
        [9, 6],
        [9, 7],
        [9, 8],
        [9, 9],
      ],
    ];

    expect(gameBoard.findSets(5).length).toBe(expected.length);
    expect(gameBoard.findSets(5)).toEqual(expect.arrayContaining(expected));
  });

  test('findSets returns an array of all valid coordinates for ship of length n', () => {
    gameBoard.placeShip([
      [4, 9],
      [5, 9],
    ]);
    gameBoard.placeShip([
      [4, 6],
      [5, 6],
      [6, 6],
    ]);
    gameBoard.placeShip([
      [6, 4],
      [7, 4],
      [8, 4],
      [9, 4],
    ]);
    gameBoard.placeShip([
      [3, 3],
      [4, 3],
      [5, 3],
      [6, 3],
    ]);
    gameBoard.placeShip([
      [3, 1],
      [4, 1],
      [5, 1],
      [6, 1],
    ]);
    gameBoard.placeShip([
      [4, 0],
      [5, 0],
    ]);
    gameBoard.placeShip([
      [0, 3],
      [0, 4],
      [0, 5],
      [0, 6],
    ]);
    gameBoard.placeShip([
      [1, 2],
      [1, 3],
    ]);
    gameBoard.placeShip([
      [1, 7],
      [1, 8],
    ]);
    gameBoard.placeShip([
      [2, 2],
      [2, 3],
    ]);
    gameBoard.placeShip([
      [3, 5],
      [3, 6],
      [3, 7],
      [3, 8],
    ]);
    gameBoard.placeShip([
      [7, 5],
      [7, 6],
      [7, 7],
      [7, 8],
    ]);
    gameBoard.placeShip([
      [8, 2],
      [8, 3],
    ]);
    gameBoard.placeShip([[9, 6]]);

    const expected = [
      [
        [1, 4],
        [2, 4],
        [3, 4],
        [4, 4],
        [5, 4],
      ],
      [
        [3, 2],
        [4, 2],
        [5, 2],
        [6, 2],
        [7, 2],
      ],
      [
        [2, 4],
        [2, 5],
        [2, 6],
        [2, 7],
        [2, 8],
      ],
      [
        [2, 5],
        [2, 6],
        [2, 7],
        [2, 8],
        [2, 9],
      ],
      [
        [8, 5],
        [8, 6],
        [8, 7],
        [8, 8],
        [8, 9],
      ],
    ];

    expect(gameBoard.findSets(5).length).toBe(expected.length);
    expect(gameBoard.findSets(5)).toEqual(expect.arrayContaining(expected));
  });

  test('findSets returns an array of all valid coordinates for ship of length n', () => {
    gameBoard.placeShip([[0, 9]]);
    expect(gameBoard.findSets(2).length).toBe(178);
    expect(gameBoard.findSets(1).length).toBe(99);
  })
});
