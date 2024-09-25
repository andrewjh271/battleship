/* eslint-disable no-param-reassign */
import { getShipData } from '../src/DOMAdapter';

describe('getShipData', () => {
  let DOMBoard;
  beforeEach(() => {
    DOMBoard = {};
  });

  test('returns an object with instrument names and coordinates', () => {
    DOMBoard = {};
    DOMBoard.children = [
      { style: { gridArea: '2 / 3 / span 5 / span 2' }, firstChild: { type: 'cello' } },
      { style: { gridArea: '4 / 8 / span 3 / span 1' }, firstChild: { type: 'violin' } },
      { style: { gridArea: '10 / 1 / span 1 / span 4' }, firstChild: { type: 'bassoon' } },
    ];
    DOMBoard.children.forEach((child) => {
      child.classList = {
        contains() {
          return true;
        },
      };
    });

    const expected = {
      cello: expect.arrayContaining([
        [2, 1],
        [3, 1],
        [2, 2],
        [3, 2],
        [2, 3],
        [3, 3],
        [2, 4],
        [3, 4],
        [2, 5],
        [3, 5],
      ]),
      violin: expect.arrayContaining([
        [7, 3],
        [7, 4],
        [7, 5],
      ]),
      bassoon: expect.arrayContaining([
        [0, 9],
        [1, 9],
        [2, 9],
        [3, 9],
      ]),
    };

    expect(getShipData(DOMBoard)).toMatchObject(expected);
  });

  test('works with different input', () => {
    DOMBoard = {};
    DOMBoard.children = [
      {
        style: { gridArea: '1 / 3 / span 2 / span 2' },
        firstChild: { type: 'horn' },
        classList: {
          contains() {
            return true;
          },
        },
      },
      {
        style: { gridArea: '9 / 6 / span 1 / span 5' },
        firstChild: { type: 'trombone' },
        classList: {
          contains() {
            return true;
          },
        },
      },
    ];

    const expected = {
      horn: expect.arrayContaining([
        [2, 0],
        [3, 0],
        [2, 1],
        [3, 1],
      ]),
      trombone: expect.arrayContaining([
        [5, 8],
        [6, 8],
        [7, 8],
        [8, 8],
        [9, 8],
      ]),
    };

    expect(getShipData(DOMBoard)).toMatchObject(expected);
  });
});
