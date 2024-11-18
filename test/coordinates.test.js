import { indexToCoordinates, coordinatesToIndex } from '../src/coordinates';
import { setRowLength } from '../src/boardSize';

describe('converts index number to x/y coordinates', () => {
  test('10x10 board', () => {
    setRowLength(10);
    expect(indexToCoordinates(0)).toEqual([0, 0]);
    expect(indexToCoordinates(10)).toEqual([0, 1]);
    expect(indexToCoordinates(36)).toEqual([6, 3]);
  });

  test('8x8 board', () => {
    setRowLength(8);
    expect(indexToCoordinates(6)).toEqual([6, 0]);
    expect(indexToCoordinates(20)).toEqual([4, 2]);
    expect(indexToCoordinates(57)).toEqual([1, 7]);
  });

  test('13x13 board', () => {
    setRowLength(13);
    expect(indexToCoordinates(19)).toEqual([6, 1]);
    expect(indexToCoordinates(140)).toEqual([10, 10]);
    expect(indexToCoordinates(93)).toEqual([2, 7]);
  });
});

describe('converts x/y coordinates to an index number', () => {
  test('10x10 board', () => {
    setRowLength(10);
    expect(coordinatesToIndex([0, 0])).toBe(0);
    expect(coordinatesToIndex([0, 1])).toBe(10);
    expect(coordinatesToIndex([6, 3])).toBe(36);
  });

  test('8x8 board', () => {
    setRowLength(8);
    expect(coordinatesToIndex([2, 0])).toBe(2);
    expect(coordinatesToIndex([1, 4])).toBe(33);
    expect(coordinatesToIndex([7, 7])).toBe(63);
  });

  test('13x13 board', () => {
    setRowLength(13);
    expect(coordinatesToIndex([8, 1])).toBe(21);
    expect(coordinatesToIndex([2, 7])).toBe(93);
    expect(coordinatesToIndex([8, 12])).toBe(164);
  });
});
