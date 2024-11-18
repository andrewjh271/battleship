import boardFactory from '../src/board';
import { computerPlayerFactory } from '../src/player';
import { rowLength } from '../src/boardSize';
import { getEnsemble } from '../src/ensemble';

describe('attacking', () => {
  test('computers can randomly attack unoccupied squares', () => {
    const opponentBoard = boardFactory();
    const moveCounterMock = { increment: () => true };
    const computer = computerPlayerFactory(null, opponentBoard, null, moveCounterMock);
    for (let i = 0; i < 100; i++) {
      computer.attack();
    }
    expect(() => computer.attack().toThrow('there are no moves left'));
  });
});

describe('placing ships', () => {
  test('computers place all ships at once', () => {
    const homeBoard = boardFactory();
    const DOMBoard = {
      placeSetImages() {},
    };
    const computer = computerPlayerFactory(homeBoard, null, DOMBoard);
    computer.setup();
    const expectedArea = Object.values(getEnsemble()).reduce(
      (area, coords) => area + coords[0] * coords[1],
      0
    );
    let totalShipArea = 0;
    for (let i = 0; i < rowLength(); i++) {
      for (let j = 0; j < rowLength(); j++) {
        if (homeBoard.squares[i][j].ship) {
          totalShipArea++;
        }
      }
    }
    expect(totalShipArea).toBe(expectedArea);
  });
});
