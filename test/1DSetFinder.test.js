import gameBoardFactory from '../src/gameboard';
import { find1DSets } from '../src/1DSetFinder';

describe('randomly placing  ships', () => {
  let gameBoard;
  beforeEach(() => {
    gameBoard = gameBoardFactory();
  });
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

    const expectedSet = [
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
        [9, 5],
        [9, 6],
        [9, 8],
        [9, 7],
        [9, 9],
      ],
      [
        [8, 5],
        [8, 6],
        [8, 7],
        [8, 8],
        [8, 9],
      ],
    ];

    const expectedContents = expectedSet.map(expected => expect.arrayContaining(expected));
    const result = find1DSets(gameBoard, 5);

    expect(result.length).toBe(expectedSet.length);
    expect(result).toEqual(expect.arrayContaining(expectedContents));
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

    const expectedSet = [
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

    const expectedContents = expectedSet.map(expected => expect.arrayContaining(expected));
    const result = find1DSets(gameBoard, 5);

    expect(result.length).toBe(expectedSet.length);
    expect(result).toEqual(expect.arrayContaining(expectedContents));
  });

  test('findSets returns an array of all valid coordinates for ship of length n', () => {
    gameBoard.placeShip([[0, 9]]);
    expect(find1DSets(gameBoard, 2).length).toBe(178);
    expect(find1DSets(gameBoard, 1).length).toBe(99);
  });
});
