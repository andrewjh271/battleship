import { indexToCoordinates, coordinatesToIndex } from '../src/coordinates';

test('converts index number to x/y coordinates', () => {
  expect(indexToCoordinates(0)).toEqual([0, 0]);
  expect(indexToCoordinates(10)).toEqual([0, 1]);
  expect(indexToCoordinates(36)).toEqual([6, 3]);
})

test('converts x/y coordinates to an index number', () => {
  expect(coordinatesToIndex([0, 0])).toBe(0);
  expect(coordinatesToIndex([0, 1])).toBe(10);
  expect(coordinatesToIndex([6, 3])).toBe(36);
})