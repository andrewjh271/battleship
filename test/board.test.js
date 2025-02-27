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

describe('allShipsSunk', () => {
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
    expect(board.allShipsSunk()).toBe(false);
    board.receiveAttack({ id, coords: [6, 6] });
    board.receiveAttack({ id, coords: [6, 3] });
    board.receiveAttack({ id, coords: [6, 4] });
    board.receiveAttack({ id, coords: [6, 5] });
    expect(board.allShipsSunk()).toBe(true);
  });
});

describe('hasUnresolvedHits', () => {
  test('empty board', () => {
    expect(board.hasUnresolvedHits()).toBe(false);
  });

  test('board with placed ships and no hits', () => {
    board.placeShip([
      [5, 0],
      [5, 1],
      [5, 2],
    ]);

    board.placeShip([
      [4, 5],
      [5, 5],
      [6, 5],
      [7, 5],
      [8, 5],
    ]);

    board.placeShip([
      [1, 7],
      [1, 8],
      [2, 7],
      [2, 8],
    ]);

    board.receiveAttack({ id, coords: [6, 6] });
    board.receiveAttack({ id, coords: [1, 0] });
    board.receiveAttack({ id, coords: [9, 9] });
    board.receiveAttack({ id, coords: [0, 7] });

    expect(board.hasUnresolvedHits()).toBe(false);
  });

  test('board with unresolved hits', () => {
    board.placeShip([
      [5, 0],
      [5, 1],
      [5, 2],
    ]);

    board.placeShip([
      [1, 7],
      [1, 8],
      [2, 7],
      [2, 8],
    ]);

    board.receiveAttack({ id, coords: [6, 6] });
    board.receiveAttack({ id, coords: [1, 0] });
    board.receiveAttack({ id, coords: [2, 7] });

    expect(board.hasUnresolvedHits()).toBe(true);
  });

  test('board with one sunk ship and misses', () => {
    board.placeShip([
      [5, 0],
      [5, 1],
      [5, 2],
    ]);

    board.placeShip([
      [1, 7],
      [1, 8],
      [2, 7],
      [2, 8],
    ]);

    board.receiveAttack({ id, coords: [5, 0] });
    board.receiveAttack({ id, coords: [4, 4] });
    board.receiveAttack({ id, coords: [5, 1] });
    board.receiveAttack({ id, coords: [5, 2] });

    expect(board.hasUnresolvedHits()).toBe(false);
  });

  test('board with one sunk ship and one unresolved hit', () => {
    board.placeShip(
      [
        [5, 0],
        [5, 1],
        [5, 2],
      ],
      'violin'
    );

    board.placeShip(
      [
        [1, 7],
        [1, 8],
        [2, 7],
        [2, 8],
      ],
      'horn'
    );

    board.receiveAttack({ id, coords: [5, 0] });
    board.receiveAttack({ id, coords: [2, 8] });
    board.receiveAttack({ id, coords: [5, 1] });
    board.receiveAttack({ id, coords: [5, 2] });

    expect(board.hasUnresolvedHits()).toBe(true);
  });
});

describe('getAdjacentSquares', () => {
  test('returns adjacent squares to a given set of coordinates', () => {
    const result = board.getAdjacentSquares([3, 4]);
    expect(result).toEqual(
      expect.objectContaining([
        [4, 4],
        [2, 4],
        [3, 5],
        [3, 3],
      ])
    );
    expect(result.length).toEqual(4);
  });

  test('filters out coordinates that are off the board', () => {
    const result = board.getAdjacentSquares([9, 9]);
    expect(result).toEqual(
      expect.objectContaining([
        [8, 9],
        [9, 8],
      ])
    );
    expect(result.length).toEqual(2);
  });
});

describe('sharedEdgeCount', () => {
  test('counts the number of shared edges', () => {
    board.placeShip(
      [
        [1, 1],
        [2, 1],
        [3, 1],
      ],
      'violin'
    );

    board.placeShip(
      [
        [4, 1],
        [5, 1],
        [6, 1],
      ],
      'flute'
    );

    board.placeShip(
      [
        [1, 2],
        [2, 2],
        [1, 3],
        [2, 3],
      ],
      'horn'
    );

    board.placeShip(
      [
        [7, 4],
        [7, 5],
      ],
      'piccolo'
    );

    board.placeShip(
      [
        [6, 2],
        [6, 3],
        [6, 4],
      ],
      'clarinet'
    );

    board.placeShip(
      [
        [1, 4],
        [2, 4],
        [3, 4],
        [4, 4],
      ],
      'bassoon'
    );

    expect(board.sharedEdgeCount()).toEqual(7);
  });

  test('words with different arrangement', () => {
    board.placeShip(
      [
        [2, 3],
        [3, 3],
        [4, 3],
        [5, 3],
        [6, 3],
        [2, 4],
        [3, 4],
        [4, 4],
        [5, 4],
        [6, 4],
      ],
      'cello'
    );

    board.placeShip(
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      'violin'
    );

    board.placeShip(
      [
        [3, 2],
        [4, 2],
        [5, 2],
      ],
      'flute'
    );

    board.placeShip(
      [
        [6, 1],
        [7, 1],
        [6, 2],
        [7, 2],
      ],
      'horn'
    );

    board.placeShip(
      [
        [7, 3],
        [8, 3],
      ],
      'piccolo'
    );

    board.placeShip(
      [
        [5, 5],
        [5, 6],
        [5, 7],
      ],
      'clarinet'
    );

    board.placeShip(
      [
        [6, 5],
        [6, 6],
        [6, 7],
      ],
      'trumpet'
    );

    expect(board.sharedEdgeCount()).toEqual(14);
  });
});

describe('willExceedMaxSharedEdges', () => {
  test('works when max has not been set', () => {
    board.placeShip(
      [
        [7, 3],
        [8, 3],
      ],
      'piccolo'
    );

    board.placeShip(
      [
        [5, 5],
        [5, 6],
        [5, 7],
      ],
      'clarinet'
    );

    board.placeShip(
      [
        [6, 5],
        [6, 6],
        [6, 7],
      ],
      'trumpet'
    );

    expect(
      board.willExceedMaxSharedEdges([
        [6, 1],
        [7, 1],
        [6, 2],
        [7, 2],
      ])
    ).toBe(false);
  });

  test('works when max has been set', () => {
    board.placeShip(
      [
        [7, 3],
        [8, 3],
      ],
      'piccolo'
    );

    board.placeShip(
      [
        [5, 5],
        [5, 6],
        [5, 7],
      ],
      'clarinet'
    );

    board.placeShip(
      [
        [6, 5],
        [6, 6],
        [6, 7],
      ],
      'trumpet'
    );
    board.setMaxSharedEdges(3);
    expect(
      board.willExceedMaxSharedEdges([
        [6, 1],
        [7, 1],
        [6, 2],
        [7, 2],
      ])
    ).toBe(true);
    board.setMaxSharedEdges(4);
    expect(
      board.willExceedMaxSharedEdges([
        [6, 1],
        [7, 1],
        [6, 2],
        [7, 2],
      ])
    ).toBe(false);
  });

  test('works with complicated board', () => {
    board.placeShip(
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      'violin'
    );

    board.placeShip(
      [
        [3, 2],
        [4, 2],
        [5, 2],
      ],
      'flute'
    );

    board.placeShip(
      [
        [6, 1],
        [7, 1],
        [6, 2],
        [7, 2],
      ],
      'horn'
    );

    board.placeShip(
      [
        [7, 3],
        [8, 3],
      ],
      'piccolo'
    );

    board.setMaxSharedEdges(6);
    expect(
      board.willExceedMaxSharedEdges([
        [4, 3],
        [5, 3],
        [6, 3],
      ])
    ).toBe(true);
    board.setMaxSharedEdges(7);
    expect(
      board.willExceedMaxSharedEdges([
        [4, 3],
        [5, 3],
        [6, 3],
      ])
    ).toBe(false);
  });
});
