import { getAdjacentSquares, containsNoEdge, containsMinorityEdges } from '../src/shipPlacement';

// tests against default 10 x 10 board

describe('getAdjacentSquares', () => {
  test('returns adjacent squares to a given set of coordinates', () => {
    const result = getAdjacentSquares([3, 4]);
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
    const result = getAdjacentSquares([9, 9]);
    expect(result).toEqual(
      expect.objectContaining([
        [8, 9],
        [9, 8],
      ])
    );
    expect(result.length).toEqual(2);
  });
});

describe('containsNoEdge', () => {
  test('returns true for a set of coordinates that contain no edge square', () => {
    expect(
      containsNoEdge([
        [1, 1],
        [1, 2],
        [1, 3],
        [1, 4],
        [2, 1],
        [2, 2],
        [2, 3],
        [2, 4],
      ])
    ).toBe(true);
  });

  test('returns false for a set of coordinates that contain an edge square', () => {
    expect(
      containsNoEdge([
        [1, 0],
        [1, 1],
        [1, 2],
        [1, 3],
        [2, 0],
        [2, 1],
        [2, 2],
        [2, 3],
      ])
    ).toBe(false);
  });
});

describe('containsMinorityEdges', () => {
  test('returns true for a set of coordinates for which less than half are edges squares', () => {
    expect(
      containsMinorityEdges([
        [1, 0],
        [1, 1],
        [1, 2],
        [1, 3],
        [2, 0],
        [2, 1],
        [2, 2],
        [2, 3],
      ])
    ).toBe(true);
  });

  test('returns false for a set of coordinates for which half or more are edges squares', () => {
    expect(
      containsMinorityEdges([
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 0],
        [1, 1],
        [2, 1],
        [3, 1],
        [4, 1],
        [5, 1],
      ])
    ).toBe(false);
  });
});
