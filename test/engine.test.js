import boardFactory from '../src/board';
import { huntDistribution, targetDistribution, selectMove } from '../src/engine';

describe('huntDistribution on a clear board', () => {
  test('distribution for 2x5 object', () => {
    const opponentBoard = boardFactory();
    opponentBoard.remainingShips = {
      cello: [2, 5],
    };

    const expectedDistribution = {
      0: 2,
      1: 4,
      2: 5,
      3: 6,
      4: 7,
      5: 7,
      6: 6,
      7: 5,
      8: 4,
      9: 2,
      10: 4,
      11: 8,
      12: 10,
      13: 12,
      14: 14,
      15: 14,
      16: 12,
      17: 10,
      18: 8,
      19: 4,
      20: 5,
      21: 10,
      22: 12,
      23: 14,
      24: 16,
      25: 16,
      26: 14,
      27: 12,
      28: 10,
      29: 5,
      30: 6,
      31: 12,
      32: 14,
      33: 16,
      34: 18,
      35: 18,
      36: 16,
      37: 14,
      38: 12,
      39: 6,
      40: 7,
      41: 14,
      42: 16,
      43: 18,
      44: 20,
      45: 20,
      46: 18,
      47: 16,
      48: 14,
      49: 7,
      50: 7,
      51: 14,
      52: 16,
      53: 18,
      54: 20,
      55: 20,
      56: 18,
      57: 16,
      58: 14,
      59: 7,
      60: 6,
      61: 12,
      62: 14,
      63: 16,
      64: 18,
      65: 18,
      66: 16,
      67: 14,
      68: 12,
      69: 6,
      70: 5,
      71: 10,
      72: 12,
      73: 14,
      74: 16,
      75: 16,
      76: 14,
      77: 12,
      78: 10,
      79: 5,
      80: 4,
      81: 8,
      82: 10,
      83: 12,
      84: 14,
      85: 14,
      86: 12,
      87: 10,
      88: 8,
      89: 4,
      90: 2,
      91: 4,
      92: 5,
      93: 6,
      94: 7,
      95: 7,
      96: 6,
      97: 5,
      98: 4,
      99: 2,
    };

    const result = huntDistribution(opponentBoard);
    expect(result.length).toBe(expectedDistribution.length);
    expect(result).toEqual(expect.objectContaining(expectedDistribution));
  });

  test('distribution for 1x4 object', () => {
    const opponentBoard = boardFactory();
    opponentBoard.remainingShips = {
      bassoon: [1, 4],
    };

    const expectedDistribution = {
      0: 2,
      1: 3,
      2: 4,
      3: 5,
      4: 5,
      5: 5,
      6: 5,
      7: 4,
      8: 3,
      9: 2,
      10: 3,
      11: 4,
      12: 5,
      13: 6,
      14: 6,
      15: 6,
      16: 6,
      17: 5,
      18: 4,
      19: 3,
      20: 4,
      21: 5,
      22: 6,
      23: 7,
      24: 7,
      25: 7,
      26: 7,
      27: 6,
      28: 5,
      29: 4,
      30: 5,
      31: 6,
      32: 7,
      33: 8,
      34: 8,
      35: 8,
      36: 8,
      37: 7,
      38: 6,
      39: 5,
      40: 5,
      41: 6,
      42: 7,
      43: 8,
      44: 8,
      45: 8,
      46: 8,
      47: 7,
      48: 6,
      49: 5,
      50: 5,
      51: 6,
      52: 7,
      53: 8,
      54: 8,
      55: 8,
      56: 8,
      57: 7,
      58: 6,
      59: 5,
      60: 5,
      61: 6,
      62: 7,
      63: 8,
      64: 8,
      65: 8,
      66: 8,
      67: 7,
      68: 6,
      69: 5,
      70: 4,
      71: 5,
      72: 6,
      73: 7,
      74: 7,
      75: 7,
      76: 7,
      77: 6,
      78: 5,
      79: 4,
      80: 3,
      81: 4,
      82: 5,
      83: 6,
      84: 6,
      85: 6,
      86: 6,
      87: 5,
      88: 4,
      89: 3,
      90: 2,
      91: 3,
      92: 4,
      93: 5,
      94: 5,
      95: 5,
      96: 5,
      97: 4,
      98: 3,
      99: 2,
    };

    const result = huntDistribution(opponentBoard);
    expect(result.length).toBe(expectedDistribution.length);
    expect(result).toEqual(expect.objectContaining(expectedDistribution));
  });

  test('distribution for 2x2 object', () => {
    const opponentBoard = boardFactory();
    opponentBoard.remainingShips = {
      horn: [2, 2],
    };

    const expectedDistribution = {
      0: 1,
      1: 2,
      2: 2,
      3: 2,
      4: 2,
      5: 2,
      6: 2,
      7: 2,
      8: 2,
      9: 1,
      10: 2,
      11: 4,
      12: 4,
      13: 4,
      14: 4,
      15: 4,
      16: 4,
      17: 4,
      18: 4,
      19: 2,
      20: 2,
      21: 4,
      22: 4,
      23: 4,
      24: 4,
      25: 4,
      26: 4,
      27: 4,
      28: 4,
      29: 2,
      30: 2,
      31: 4,
      32: 4,
      33: 4,
      34: 4,
      35: 4,
      36: 4,
      37: 4,
      38: 4,
      39: 2,
      40: 2,
      41: 4,
      42: 4,
      43: 4,
      44: 4,
      45: 4,
      46: 4,
      47: 4,
      48: 4,
      49: 2,
      50: 2,
      51: 4,
      52: 4,
      53: 4,
      54: 4,
      55: 4,
      56: 4,
      57: 4,
      58: 4,
      59: 2,
      60: 2,
      61: 4,
      62: 4,
      63: 4,
      64: 4,
      65: 4,
      66: 4,
      67: 4,
      68: 4,
      69: 2,
      70: 2,
      71: 4,
      72: 4,
      73: 4,
      74: 4,
      75: 4,
      76: 4,
      77: 4,
      78: 4,
      79: 2,
      80: 2,
      81: 4,
      82: 4,
      83: 4,
      84: 4,
      85: 4,
      86: 4,
      87: 4,
      88: 4,
      89: 2,
      90: 1,
      91: 2,
      92: 2,
      93: 2,
      94: 2,
      95: 2,
      96: 2,
      97: 2,
      98: 2,
      99: 1,
    };

    const result = huntDistribution(opponentBoard);
    expect(result.length).toBe(expectedDistribution.length);
    expect(result).toEqual(expect.objectContaining(expectedDistribution));
  });

  test('distribution for 3 objects', () => {
    const opponentBoard = boardFactory();
    opponentBoard.remainingShips = {
      cello: [2, 5],
      bassoon: [1, 4],
      horn: [2, 2],
    };

    const expectedDistribution = {
      0: 5,
      1: 9,
      2: 11,
      3: 13,
      4: 14,
      5: 14,
      6: 13,
      7: 11,
      8: 9,
      9: 5,
      10: 9,
      11: 16,
      12: 19,
      13: 22,
      14: 24,
      15: 24,
      16: 22,
      17: 19,
      18: 16,
      19: 9,
      20: 11,
      21: 19,
      22: 22,
      23: 25,
      24: 27,
      25: 27,
      26: 25,
      27: 22,
      28: 19,
      29: 11,
      30: 13,
      31: 22,
      32: 25,
      33: 28,
      34: 30,
      35: 30,
      36: 28,
      37: 25,
      38: 22,
      39: 13,
      40: 14,
      41: 24,
      42: 27,
      43: 30,
      44: 32,
      45: 32,
      46: 30,
      47: 27,
      48: 24,
      49: 14,
      50: 14,
      51: 24,
      52: 27,
      53: 30,
      54: 32,
      55: 32,
      56: 30,
      57: 27,
      58: 24,
      59: 14,
      60: 13,
      61: 22,
      62: 25,
      63: 28,
      64: 30,
      65: 30,
      66: 28,
      67: 25,
      68: 22,
      69: 13,
      70: 11,
      71: 19,
      72: 22,
      73: 25,
      74: 27,
      75: 27,
      76: 25,
      77: 22,
      78: 19,
      79: 11,
      80: 9,
      81: 16,
      82: 19,
      83: 22,
      84: 24,
      85: 24,
      86: 22,
      87: 19,
      88: 16,
      89: 9,
      90: 5,
      91: 9,
      92: 11,
      93: 13,
      94: 14,
      95: 14,
      96: 13,
      97: 11,
      98: 9,
      99: 5,
    };

    const result = huntDistribution(opponentBoard);
    expect(result.length).toBe(expectedDistribution.length);
    expect(result).toEqual(expect.objectContaining(expectedDistribution));
  });
});

describe('huntDistribution on a board with sunk ships', () => {
  const id = 1;
  const board = boardFactory(id);
  test('distribution for 2x5 object', () => {
    board.remainingShips = {
      cello: [2, 5],
    };

    board.placeShip([
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3],
      [2, 0],
      [2, 1],
      [2, 2],
      [2, 3],
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

    board.placeShip([
      [7, 0],
      [8, 0],
      [9, 0],
    ]);

    // hits
    board.receiveAttack({ id, coords: [1, 0] });
    board.receiveAttack({ id, coords: [1, 1] });
    board.receiveAttack({ id, coords: [1, 2] });
    board.receiveAttack({ id, coords: [1, 3] });
    board.receiveAttack({ id, coords: [2, 0] });
    board.receiveAttack({ id, coords: [2, 1] });
    board.receiveAttack({ id, coords: [2, 2] });
    board.receiveAttack({ id, coords: [2, 3] });
    board.receiveAttack({ id, coords: [4, 5] });
    board.receiveAttack({ id, coords: [5, 5] });
    board.receiveAttack({ id, coords: [6, 5] });
    board.receiveAttack({ id, coords: [7, 5] });
    board.receiveAttack({ id, coords: [8, 5] });
    board.receiveAttack({ id, coords: [1, 7] });
    board.receiveAttack({ id, coords: [1, 8] });
    board.receiveAttack({ id, coords: [2, 7] });
    board.receiveAttack({ id, coords: [2, 8] });

    const expectedDistribution = {
      3: 2,
      4: 4,
      5: 5,
      6: 5,
      7: 5,
      8: 4,
      9: 2,
      13: 3,
      14: 6,
      15: 8,
      16: 8,
      17: 8,
      18: 6,
      19: 3,
      23: 3,
      24: 6,
      25: 8,
      26: 8,
      27: 8,
      28: 6,
      29: 3,
      33: 3,
      34: 6,
      35: 8,
      36: 8,
      37: 8,
      38: 6,
      39: 3,
      43: 2,
      44: 4,
      45: 5,
      46: 5,
      47: 5,
      48: 4,
      49: 2,
      63: 1,
      64: 2,
      65: 3,
      66: 3,
      67: 3,
      68: 2,
      69: 1,
      73: 2,
      74: 4,
      75: 6,
      76: 6,
      77: 6,
      78: 4,
      79: 2,
      83: 2,
      84: 4,
      85: 6,
      86: 6,
      87: 6,
      88: 4,
      89: 2,
      93: 1,
      94: 2,
      95: 3,
      96: 3,
      97: 3,
      98: 2,
      99: 1,
    };

    const result = huntDistribution(board);
    expect(result.length).toBe(expectedDistribution.length);
    expect(result).toEqual(expect.objectContaining(expectedDistribution));
  });
});

describe('huntDistribution on a board with sunk ships and attacks', () => {
  const id = 1;
  const board = boardFactory(id);

  board.placeShip([
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
  ]);

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

  board.placeShip([
    [7, 0],
    [8, 0],
    [9, 0],
  ]);

  // hits
  board.receiveAttack({ id, coords: [1, 0] });
  board.receiveAttack({ id, coords: [1, 1] });
  board.receiveAttack({ id, coords: [1, 2] });
  board.receiveAttack({ id, coords: [1, 3] });
  board.receiveAttack({ id, coords: [2, 0] });
  board.receiveAttack({ id, coords: [2, 1] });
  board.receiveAttack({ id, coords: [2, 2] });
  board.receiveAttack({ id, coords: [2, 3] });
  board.receiveAttack({ id, coords: [4, 5] });
  board.receiveAttack({ id, coords: [5, 5] });
  board.receiveAttack({ id, coords: [6, 5] });
  board.receiveAttack({ id, coords: [7, 5] });
  board.receiveAttack({ id, coords: [8, 5] });
  board.receiveAttack({ id, coords: [1, 7] });
  board.receiveAttack({ id, coords: [1, 8] });
  board.receiveAttack({ id, coords: [2, 7] });
  board.receiveAttack({ id, coords: [2, 8] });
  board.receiveAttack({ id, coords: [5, 0] });
  board.receiveAttack({ id, coords: [5, 1] });
  board.receiveAttack({ id, coords: [5, 2] });
  board.receiveAttack({ id, coords: [9, 0] });

  // misses
  board.receiveAttack({ id, coords: [6, 1] });
  board.receiveAttack({ id, coords: [0, 2] });
  board.receiveAttack({ id, coords: [7, 2] });
  board.receiveAttack({ id, coords: [4, 3] });
  board.receiveAttack({ id, coords: [1, 5] });
  board.receiveAttack({ id, coords: [9, 5] });
  board.receiveAttack({ id, coords: [0, 6] });
  board.receiveAttack({ id, coords: [8, 6] });
  board.receiveAttack({ id, coords: [4, 7] });
  board.receiveAttack({ id, coords: [4, 8] });
  board.receiveAttack({ id, coords: [3, 9] });
  board.receiveAttack({ id, coords: [9, 9] });

  test('distribution for 2x5 object', () => {
    board.remainingShips = {
      cello: [2, 5],
    };

    const expectedDistribution = {
      35: 1,
      36: 1,
      37: 1,
      38: 1,
      39: 1,
      45: 1,
      46: 1,
      47: 1,
      48: 1,
      49: 1,
      75: 1,
      76: 1,
      77: 1,
      78: 1,
      79: 1,
      85: 1,
      86: 1,
      87: 1,
      88: 1,
      89: 1,
    };

    const result = huntDistribution(board);
    expect(result.length).toBe(expectedDistribution.length);
    expect(result).toEqual(expect.objectContaining(expectedDistribution));
  });

  test('distribution for 1x4 object', () => {
    board.remainingShips = {
      bassoon: [1, 4],
    };

    const expectedDistribution = {
      3: 1,
      8: 1,
      13: 2,
      18: 2,
      19: 1,
      23: 3,
      28: 2,
      29: 1,
      33: 4,
      35: 1,
      36: 2,
      37: 2,
      38: 4,
      39: 2,
      40: 1,
      41: 2,
      42: 3,
      43: 8,
      44: 4,
      45: 4,
      46: 4,
      47: 3,
      48: 3,
      49: 2,
      53: 4,
      61: 1,
      62: 2,
      63: 6,
      64: 4,
      65: 4,
      66: 3,
      67: 2,
      73: 2,
      75: 2,
      76: 3,
      77: 3,
      78: 2,
      79: 1,
      83: 1,
      85: 2,
      86: 3,
      87: 3,
      88: 2,
      89: 1,
      94: 1,
      95: 3,
      96: 3,
      97: 3,
      98: 1,
    };

    const result = huntDistribution(board);
    expect(result.length).toBe(expectedDistribution.length);
    expect(result).toEqual(expect.objectContaining(expectedDistribution));
  });

  test('distribution for 2x2 object', () => {
    board.remainingShips = {
      horn: [2, 2],
    };

    const expectedDistribution = {
      3: 1,
      4: 1,
      7: 1,
      8: 1,
      13: 2,
      14: 2,
      17: 1,
      18: 2,
      19: 1,
      23: 1,
      24: 1,
      28: 2,
      29: 2,
      35: 1,
      36: 2,
      37: 2,
      38: 3,
      39: 2,
      42: 1,
      43: 1,
      45: 1,
      46: 2,
      47: 2,
      48: 2,
      49: 1,
      52: 2,
      53: 2,
      62: 1,
      63: 1,
      65: 1,
      66: 2,
      67: 1,
      75: 2,
      76: 4,
      77: 3,
      78: 2,
      79: 1,
      85: 2,
      86: 4,
      87: 4,
      88: 3,
      89: 1,
      95: 1,
      96: 2,
      97: 2,
      98: 1,
    };

    const result = huntDistribution(board);
    expect(result.length).toBe(expectedDistribution.length);
    expect(result).toEqual(expect.objectContaining(expectedDistribution));
  });

  test('distribution 3 objects', () => {
    board.remainingShips = {
      cello: [5, 2],
      bassoon: [4, 1],
      horn: [2, 2],
    };

    const expectedDistribution = {
      3: 2,
      4: 1,
      7: 1,
      8: 2,
      13: 4,
      14: 2,
      17: 1,
      18: 4,
      19: 2,
      23: 4,
      24: 1,
      28: 4,
      29: 3,
      33: 4,
      35: 3,
      36: 5,
      37: 5,
      38: 8,
      39: 5,
      40: 1,
      41: 2,
      42: 4,
      43: 9,
      44: 4,
      45: 6,
      46: 7,
      47: 6,
      48: 6,
      49: 4,
      52: 2,
      53: 6,
      61: 1,
      62: 3,
      63: 7,
      64: 4,
      65: 5,
      66: 5,
      67: 3,
      73: 2,
      75: 5,
      76: 8,
      77: 7,
      78: 5,
      79: 3,
      83: 1,
      85: 5,
      86: 8,
      87: 8,
      88: 6,
      89: 3,
      94: 1,
      95: 4,
      96: 5,
      97: 5,
      98: 2,
    };

    const result = huntDistribution(board);
    expect(result.length).toBe(expectedDistribution.length);
    expect(result).toEqual(expect.objectContaining(expectedDistribution));
  });
});

describe('huntDistribution error handling', () => {
  test('throws error message when board.remainingObjects is empty', () => {
    const board = boardFactory();
    board.remainingShips = {};

    expect(() => huntDistribution(board)).toThrow('There are no remaining ships to test');
  });
});

describe('selectMove', () => {
  test('returns the key (in coordinate form) with max value', () => {
    const distribution = {
      3: 2,
      4: 1,
      7: 1,
      8: 2,
      13: 5,
      14: 2,
      17: 1,
      18: 4,
      19: 2,
      23: 4,
      24: 1,
      29: 3,
    };
    expect(selectMove(distribution)).toEqual([3, 1]);
  });

  test('can return any key that shares a maximum value', () => {
    const distribution = {
      0: 5,
      1: 9,
      2: 11,
      3: 13,
      4: 14,
      5: 14,
      6: 13,
      7: 11,
      8: 9,
      9: 5,
      10: 9,
      11: 16,
      12: 19,
      13: 22,
      14: 24,
      15: 24,
      16: 22,
      17: 19,
      18: 16,
      19: 9,
      20: 11,
      21: 19,
      22: 22,
      23: 25,
      24: 27,
      25: 27,
      26: 25,
      27: 22,
      28: 19,
      29: 11,
      30: 13,
      31: 22,
      32: 25,
      33: 28,
      34: 30,
      35: 30,
      36: 28,
      37: 25,
      38: 22,
      39: 13,
      40: 14,
      41: 24,
      42: 27,
      43: 30,
      44: 32,
      45: 32,
      46: 30,
      47: 27,
      48: 24,
      49: 14,
      50: 14,
      51: 24,
      52: 27,
      53: 30,
      54: 32,
      55: 32,
      56: 30,
      57: 27,
      58: 24,
      59: 14,
      60: 13,
      61: 22,
      62: 25,
      63: 28,
      64: 30,
      65: 30,
      66: 28,
      67: 25,
      68: 22,
      69: 13,
      70: 11,
      71: 19,
      72: 22,
      73: 25,
      74: 27,
      75: 27,
      76: 25,
      77: 22,
      78: 19,
      79: 11,
      80: 9,
      81: 16,
      82: 19,
      83: 22,
      84: 24,
      85: 24,
      86: 22,
      87: 19,
      88: 16,
      89: 9,
      90: 5,
      91: 9,
      92: 11,
      93: 13,
      94: 14,
      95: 14,
      96: 13,
      97: 11,
      98: 9,
      99: 5,
    };

    const possibleMoves = [
      [4, 4],
      [5, 4],
      [4, 5],
      [5, 5],
    ];

    expect(possibleMoves).toContainEqual(selectMove(distribution));
  });

  test('can return any key that shares a maximum value', () => {
    const distribution = {
      0: 5,
      1: 9,
      2: 11,
      3: 13,
      4: 14,
      5: 14,
      6: 13,
      7: 11,
      8: 9,
      9: 5,
      10: 9,
      11: 16,
      12: 19,
      13: 22,
      14: 36,
      15: 24,
      16: 22,
      17: 19,
      18: 16,
      19: 9,
      20: 11,
      21: 19,
      22: 22,
      23: 25,
      24: 27,
      25: 27,
      26: 25,
      27: 36,
      28: 19,
      29: 11,
      30: 13,
      31: 22,
      32: 25,
      33: 28,
      34: 30,
      35: 30,
      36: 36,
      37: 25,
      38: 22,
      39: 13,
      40: 14,
    };

    const possibleMoves = [
      [4, 1],
      [7, 2],
      [6, 3],
    ];

    expect(possibleMoves).toContainEqual(selectMove(distribution));
  });

  test('can return any key that shares a maximum value', () => {
    expect(() => selectMove({})).toThrow('Distribution object is empty');
  });
});

describe('targetDistribution on a clear board', () => {
  test('distribution for 2x5 object', () => {
    const opponentBoard = boardFactory();
    opponentBoard.remainingShips = {
      cello: [2, 5],
    };

    const expectedDistribution = {
      0: 4,
      1: 8,
      2: 10,
      3: 12,
      4: 14,
      5: 14,
      6: 12,
      7: 10,
      8: 8,
      9: 4,
      10: 8,
      11: 16,
      12: 20,
      13: 24,
      14: 28,
      15: 28,
      16: 24,
      17: 20,
      18: 16,
      19: 8,
      20: 10,
      21: 20,
      22: 24,
      23: 28,
      24: 32,
      25: 32,
      26: 28,
      27: 24,
      28: 20,
      29: 10,
      30: 12,
      31: 24,
      32: 28,
      33: 32,
      34: 36,
      35: 36,
      36: 32,
      37: 28,
      38: 24,
      39: 12,
      40: 14,
      41: 28,
      42: 32,
      43: 36,
      44: 40,
      45: 40,
      46: 36,
      47: 32,
      48: 28,
      49: 14,
      50: 14,
      51: 28,
      52: 32,
      53: 36,
      54: 40,
      55: 40,
      56: 36,
      57: 32,
      58: 28,
      59: 14,
      60: 12,
      61: 24,
      62: 28,
      63: 32,
      64: 36,
      65: 36,
      66: 32,
      67: 28,
      68: 24,
      69: 12,
      70: 10,
      71: 20,
      72: 24,
      73: 28,
      74: 32,
      75: 32,
      76: 28,
      77: 24,
      78: 20,
      79: 10,
      80: 8,
      81: 16,
      82: 20,
      83: 24,
      84: 28,
      85: 28,
      86: 24,
      87: 20,
      88: 16,
      89: 8,
      90: 4,
      91: 8,
      92: 10,
      93: 12,
      94: 14,
      95: 14,
      96: 12,
      97: 10,
      98: 8,
      99: 4,
    };

    const result = targetDistribution(opponentBoard);
    expect(result.length).toBe(expectedDistribution.length);
    expect(result).toEqual(expect.objectContaining(expectedDistribution));
  });

  test('distribution for 3 objects', () => {
    const opponentBoard = boardFactory();
    opponentBoard.remainingShips = {
      cello: [2, 5],
      bassoon: [1, 4],
      horn: [2, 2],
    };

    const expectedDistribution = {
      0: 10,
      1: 18,
      2: 22,
      3: 26,
      4: 28,
      5: 28,
      6: 26,
      7: 22,
      8: 18,
      9: 10,
      10: 18,
      11: 32,
      12: 38,
      13: 44,
      14: 48,
      15: 48,
      16: 44,
      17: 38,
      18: 32,
      19: 18,
      20: 22,
      21: 38,
      22: 44,
      23: 50,
      24: 54,
      25: 54,
      26: 50,
      27: 44,
      28: 38,
      29: 22,
      30: 26,
      31: 44,
      32: 50,
      33: 56,
      34: 60,
      35: 60,
      36: 56,
      37: 50,
      38: 44,
      39: 26,
      40: 28,
      41: 48,
      42: 54,
      43: 60,
      44: 64,
      45: 64,
      46: 60,
      47: 54,
      48: 48,
      49: 28,
      50: 28,
      51: 48,
      52: 54,
      53: 60,
      54: 64,
      55: 64,
      56: 60,
      57: 54,
      58: 48,
      59: 28,
      60: 26,
      61: 44,
      62: 50,
      63: 56,
      64: 60,
      65: 60,
      66: 56,
      67: 50,
      68: 44,
      69: 26,
      70: 22,
      71: 38,
      72: 44,
      73: 50,
      74: 54,
      75: 54,
      76: 50,
      77: 44,
      78: 38,
      79: 22,
      80: 18,
      81: 32,
      82: 38,
      83: 44,
      84: 48,
      85: 48,
      86: 44,
      87: 38,
      88: 32,
      89: 18,
      90: 10,
      91: 18,
      92: 22,
      93: 26,
      94: 28,
      95: 28,
      96: 26,
      97: 22,
      98: 18,
      99: 10,
    };

    const result = targetDistribution(opponentBoard);
    expect(result.length).toBe(expectedDistribution.length);
    expect(result).toEqual(expect.objectContaining(expectedDistribution));
  });
});

describe('targetDistribution on a board with ships, hits, and misses', () => {
  const id = 1;
  const board = boardFactory(id);

  board.placeShip([
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
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

  board.receiveAttack({ id, coords: [2, 0] });
  board.receiveAttack({ id, coords: [6, 0] });
  board.receiveAttack({ id, coords: [2, 1] });
  board.receiveAttack({ id, coords: [5, 1] });
  board.receiveAttack({ id, coords: [7, 1] });
  board.receiveAttack({ id, coords: [9, 1] });
  board.receiveAttack({ id, coords: [2, 2] });
  board.receiveAttack({ id, coords: [3, 2] });
  board.receiveAttack({ id, coords: [4, 2] });
  board.receiveAttack({ id, coords: [8, 2] });
  board.receiveAttack({ id, coords: [0, 3] });
  board.receiveAttack({ id, coords: [1, 3] });
  board.receiveAttack({ id, coords: [2, 3] });
  board.receiveAttack({ id, coords: [5, 3] });
  board.receiveAttack({ id, coords: [8, 3] });
  board.receiveAttack({ id, coords: [4, 4] });
  board.receiveAttack({ id, coords: [8, 4] });
  board.receiveAttack({ id, coords: [1, 5] });
  board.receiveAttack({ id, coords: [6, 5] });
  board.receiveAttack({ id, coords: [7, 5] });
  board.receiveAttack({ id, coords: [9, 5] });
  board.receiveAttack({ id, coords: [1, 6] });
  board.receiveAttack({ id, coords: [4, 6] });
  board.receiveAttack({ id, coords: [8, 6] });
  board.receiveAttack({ id, coords: [0, 7] });
  board.receiveAttack({ id, coords: [2, 7] });
  board.receiveAttack({ id, coords: [4, 7] });
  board.receiveAttack({ id, coords: [5, 7] });
  board.receiveAttack({ id, coords: [6, 7] });
  board.receiveAttack({ id, coords: [7, 7] });
  board.receiveAttack({ id, coords: [8, 7] });
  board.receiveAttack({ id, coords: [2, 8] });
  board.receiveAttack({ id, coords: [3, 8] });
  board.receiveAttack({ id, coords: [4, 8] });
  board.receiveAttack({ id, coords: [6, 8] });
  board.receiveAttack({ id, coords: [1, 9] });
  board.receiveAttack({ id, coords: [2, 9] });
  board.receiveAttack({ id, coords: [4, 9] });
  board.receiveAttack({ id, coords: [7, 9] });

  test('distribution for 2x5 object', () => {
    board.remainingShips = {
      cello: [2, 5],
    };

    const expectedDistribution = {
      0: 226,
      1: 759602,
      3: 226,
      4: 226,
      10: 226,
      11: 759602,
      13: 226,
      14: 226,
      21: 759376,
      26: 226,
      27: 226,
      33: 226,
      36: 226,
      37: 226,
      41: 759376,
      42: 759602,
      43: 226,
      46: 226,
      47: 226,
      52: 226,
      53: 226,
      62: 226,
      63: 226,
      66: 226,
      67: 226,
      73: 226,
    };

    const result = targetDistribution(board);
    expect(result.length).toBe(expectedDistribution.length);
    expect(result).toEqual(expect.objectContaining(expectedDistribution));
  });

  test('distribution for a 4x1 object', () => {
    board.remainingShips = {
      bassoon: [1, 4],
    };

    const expectedDistribution = {
      0: 16,
      1: 48,
      3: 48,
      4: 32,
      5: 16,
      10: 16,
      11: 64,
      13: 32,
      14: 16,
      16: 2,
      21: 32,
      26: 18,
      27: 16,
      33: 228,
      34: 226,
      36: 34,
      37: 32,
      40: 2,
      41: 18,
      42: 3636,
      43: 6,
      46: 34,
      47: 32,
      52: 486,
      53: 22,
      54: 244,
      55: 470,
      58: 226,
      62: 258,
      63: 4,
      66: 16,
      67: 16,
      69: 2,
      73: 2,
      79: 2,
      89: 2,
      99: 2,
    };

    const result = targetDistribution(board);
    expect(result.length).toBe(expectedDistribution.length);
    expect(result).toEqual(expect.objectContaining(expectedDistribution));
  });

  test('distribution for a 2x2 object', () => {
    board.remainingShips = {
      horn: [2, 2],
    };

    const expectedDistribution = {
      0: 2,
      1: 228,
      3: 228,
      4: 2,
      10: 4,
      11: 456,
      13: 228,
      14: 2,
      20: 2,
      21: 3604,
      26: 2,
      27: 2,
      33: 16,
      36: 4,
      37: 4,
      41: 226,
      42: 244,
      43: 18,
      45: 16,
      46: 244,
      47: 228,
      52: 4,
      53: 4,
      55: 32,
      62: 18,
      63: 18,
      65: 16,
      66: 242,
      67: 226,
      71: 226,
      73: 16,
      81: 226,
      88: 2,
      89: 2,
      98: 2,
      99: 2,
    };

    const result = targetDistribution(board);
    expect(result.length).toBe(expectedDistribution.length);
    expect(result).toEqual(expect.objectContaining(expectedDistribution));
  });

  test('distribution for 3 objects', () => {
    board.remainingShips = {
      cello: [5, 2],
      bassoon: [1, 4],
      horn: [2, 2],
    };

    const expectedDistribution = {
      0: 244,
      1: 759878,
      3: 502,
      4: 260,
      5: 16,
      10: 246,
      11: 760122,
      13: 486,
      14: 244,
      16: 2,
      20: 2,
      21: 763012,
      26: 246,
      27: 244,
      33: 470,
      34: 226,
      36: 264,
      37: 262,
      40: 2,
      41: 759620,
      42: 763482,
      43: 250,
      45: 16,
      46: 504,
      47: 486,
      52: 716,
      53: 252,
      54: 244,
      55: 502,
      58: 226,
      62: 502,
      63: 248,
      65: 16,
      66: 484,
      67: 468,
      69: 2,
      71: 226,
      73: 244,
      79: 2,
      81: 226,
      88: 2,
      89: 4,
      98: 2,
      99: 4,
    };

    const result = targetDistribution(board);
    expect(result.length).toBe(expectedDistribution.length);
    expect(result).toEqual(expect.objectContaining(expectedDistribution));
  });
});

describe('targetDistribution error handling', () => {
  test('throws error message when board.remainingObjects is empty', () => {
    const board = boardFactory();
    board.remainingShips = {};

    expect(() => targetDistribution(board)).toThrow('There are no remaining ships to test');
  });
});
