import { find2DSets } from "../src/2DSetFinder";
import gameBoardFactory from '../src/gameboard';

describe('finds the correct number of sets on empty boards', () => {
  let gameBoard;
  beforeAll(() => {
    gameBoard = gameBoardFactory();
  })

  test('2x2 object', () => {
    expect(find2DSets(gameBoard, 2, 2).length).toBe(81);
  })
  
  test('4x4 object', () => {
    expect(find2DSets(gameBoard, 4, 4).length).toBe(49);
  })

  test('5x2 object', () => {
    expect(find2DSets(gameBoard, 5, 2).length).toBe(108);
  })
  
  test('5x4 object', () => {
    expect(find2DSets(gameBoard, 5, 4).length).toBe(84);
  })

  test('5x3 object', () => {
    expect(find2DSets(gameBoard, 5, 3).length).toBe(96);
  })

  test('5x1 object', () => {
    expect(find2DSets(gameBoard, 5, 1).length).toBe(120);
  })

  test('1x2 object', () => {
    expect(find2DSets(gameBoard, 1, 2).length).toBe(180);
  })
  
})

describe('returns an array of all valid sets of coordinates for ship of x and y dimensions', () => {
  let gameBoard;
  beforeEach(() => {
    gameBoard = gameBoardFactory();
  })
  
  test('5x2 object', () => {
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

    const expectedSet =  [
      [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
        [0, 2],
        [1, 2],
        [0, 3],
        [1, 3],
        [0, 4],
        [1, 4]
      ],
      [
        [8, 5],
        [9, 5],
        [8, 6],
        [9, 6],
        [8, 7],
        [9, 7],
        [8, 8],
        [9, 8],
        [8, 9],
        [9, 9]
      ]
    ]

    const result = find2DSets(gameBoard, 5, 2)
    const expectedContents = expectedSet.map(expected => expect.arrayContaining(expected));

    expect(result.length).toBe(expectedContents.length);
    expect(result).toEqual(expect.arrayContaining(expectedContents));
  })
    
  test('2x2 object', () => {
    gameBoard.placeShip([
      [1, 1],
      [2, 1],
      [3, 1],
    ]);
    gameBoard.placeShip([
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
      [1, 6],
    ]);
    gameBoard.placeShip([
      [2, 4],
      [3, 4],
      [2, 5],
      [3, 5],
    ]);
    gameBoard.placeShip([
      [4, 4],
      [4, 5],
      [4, 6],
    ]);
    gameBoard.placeShip([
      [1, 8],
      [2, 8],
      [3, 8],
      [4, 8],
      [5, 8],
    ]);
    gameBoard.placeShip([
      [5, 1],
      [5, 2],
      [5, 3],
      [5, 4],
      [6, 1],
      [6, 2],
      [6, 3],
      [6, 4],
    ]);
    gameBoard.placeShip([
      [7, 6],
      [7, 7],
      [7, 8],
      [7, 9],
    ]);
    gameBoard.placeShip([
      [8, 2],
      [8, 3],
      [8, 4],
    ]);
    gameBoard.placeShip([
      [8, 7],
      [8, 8],
      [9, 7],
      [9, 8],
    ]);

    const expectedSet =  [
      [
        [2, 2],
        [3, 2],
        [2, 3],
        [3, 3],
      ],
      [
        [3, 2],
        [3, 3],
        [4, 2],
        [4, 2],
      ],
      [
        [2, 6],
        [3, 6],
        [2, 7],
        [3, 7],
      ],
      [
        [5, 5],
        [6, 5],
        [5, 6],
        [6, 6],
      ],
      [
        [5, 6],
        [6, 6],
        [5, 7],
        [6, 7],
      ],
      [
        [7, 0],
        [7, 1],
        [8, 0],
        [8, 1],
      ],
      [
        [8, 0],
        [8, 1],
        [9, 0],
        [9, 1],
      ],
      [
        [8, 5],
        [8, 6],
        [9, 5],
        [9, 6],
      ]
    ]
    const result = find2DSets(gameBoard, 2, 2)
    const expectedContents = expectedSet.map(expected => expect.arrayContaining(expected));

    expect(result.length).toBe(expectedContents.length);
    expect(result).toEqual(expect.arrayContaining(expectedContents));
  })

  test('2x3 object', () => {
    gameBoard.placeShip([
      [1, 1],
      [2, 1],
      [3, 1],
    ]);
    gameBoard.placeShip([
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
      [1, 6],
    ]);
    gameBoard.placeShip([
      [2, 4],
      [3, 4],
      [2, 5],
      [3, 5],
    ]);
    gameBoard.placeShip([
      [4, 4],
      [4, 5],
      [4, 6],
    ]);
    gameBoard.placeShip([
      [1, 8],
      [2, 8],
      [3, 8],
      [4, 8],
      [5, 8],
    ]);
    gameBoard.placeShip([
      [5, 1],
      [5, 2],
      [5, 3],
      [5, 4],
      [6, 1],
      [6, 2],
      [6, 3],
      [6, 4],
    ]);
    gameBoard.placeShip([
      [7, 6],
      [7, 7],
      [7, 8],
      [7, 9],
    ]);
    gameBoard.placeShip([
      [8, 2],
      [8, 3],
      [8, 4],
    ]);
    gameBoard.placeShip([
      [8, 7],
      [8, 8],
      [9, 7],
      [9, 8],
    ]);

    const expectedSet =  [
      [
        [2, 2],
        [3, 3],
        [3, 2],
        [3, 3],
        [4, 2],
        [4, 2],
      ],
      [
        [5, 5],
        [6, 5],
        [5, 6],
        [6, 6],
        [5, 7],
        [6, 7],
      ],
      [
        [7, 0],
        [7, 1],
        [8, 0],
        [8, 1],
        [9, 0],
        [9, 1],
      ]
    ]
    const result = find2DSets(gameBoard, 2, 3)
    const expectedContents = expectedSet.map(expected => expect.arrayContaining(expected));

    expect(result.length).toBe(expectedContents.length);
    expect(result).toEqual(expect.arrayContaining(expectedContents));
  })

  test('2x5 object', () => {
    gameBoard.placeShip([
      [1, 1],
      [2, 1],
      [3, 1],
    ]);
    gameBoard.placeShip([
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
      [1, 6],
    ]);
    gameBoard.placeShip([
      [2, 4],
      [3, 4],
      [2, 5],
      [3, 5],
    ]);
    gameBoard.placeShip([
      [4, 4],
      [4, 5],
      [4, 6],
    ]);
    gameBoard.placeShip([
      [1, 8],
      [2, 8],
      [3, 8],
      [4, 8],
    ]);
    gameBoard.placeShip([
      [5, 1],
      [5, 2],
      [5, 3],
      [5, 4],
      [6, 1],
      [6, 2],
      [6, 3],
      [6, 4],
    ]);
    gameBoard.placeShip([
      [7, 6],
      [7, 7],
      [7, 8],
      [7, 9],
    ]);
    gameBoard.placeShip([
      [8, 2],
      [8, 3],
      [8, 4],
    ]);
    gameBoard.placeShip([
      [8, 7],
      [8, 8],
      [9, 7],
      [9, 8],
    ]);

    const expectedSet =  [
      [
        [5, 5],
        [6, 5],
        [5, 6],
        [6, 6],
        [5, 7],
        [6, 7],
        [5, 8],
        [6, 8],
        [5, 9],
        [6, 9],
      ]
    ]
    const result = find2DSets(gameBoard, 2, 5)
    expect(result.length).toBe(expectedSet.length);
    expect(result).toEqual(expect.arrayContaining(expectedSet));
  })
})