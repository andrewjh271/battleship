import boardFactory from '../src/board';
import { computerPlayerFactory } from '../src/player';
import { rowLength } from '../src/boardSize';
import { getEnsemble } from '../src/ensemble';

describe('attacking', () => {
  const moveCounterMock = { increment: () => true };
  const mockHomeDOMBoard = { placeSetImages: () => true };

  test('computer can attack until it has sunk all ships', () => {
    const opponentBoard = boardFactory(1);
    const computer = computerPlayerFactory(null, opponentBoard, null, moveCounterMock);
    const opponent = computerPlayerFactory(opponentBoard, null, mockHomeDOMBoard);

    opponent.setup();

    while (!computer.sunkAllShips()) {
      computer.attack();
    }
    expect(opponentBoard.remainingShips).toEqual({});
    expect(() => computer.attack()).toThrow('There are no remaining ships to test');
  });

  test('computer attack count falls within an expected range', () => {
    const opponentBoard = boardFactory(1);
    const computer = computerPlayerFactory(null, opponentBoard, null, moveCounterMock);
    const opponent = computerPlayerFactory(opponentBoard, null, mockHomeDOMBoard);

    opponent.setup();

    let moveCount = 0;
    while (!computer.sunkAllShips()) {
      computer.attack();
      moveCount++;
    }

    expect(moveCount).toBeGreaterThanOrEqual(37);
    expect(moveCount).toBeLessThan(77);
  });

  test('computer attack statistics', () => {
    let totalMoveCount = 0;
    let minMoveCount = Infinity;
    let maxMoveCount = -Infinity;
    const n = 30;

    for (let i = 0; i < n; i++) {
      let moveCount = 0;
      const opponentBoard = boardFactory(1);
      const computer = computerPlayerFactory(null, opponentBoard, null, moveCounterMock);
      const opponent = computerPlayerFactory(opponentBoard, null, mockHomeDOMBoard);

      opponent.setup();
      while (!computer.sunkAllShips()) {
        computer.attack();
        moveCount++;
      }

      if (moveCount < minMoveCount) {
        minMoveCount = moveCount;
      }
      if (moveCount > maxMoveCount) {
        maxMoveCount = moveCount;
      }
      totalMoveCount += moveCount;
    }

    const avgMoveCount = totalMoveCount / n;

    // console.log(`Minimum moves: ${minMoveCount}`);
    // console.log(`Maximum moves: ${maxMoveCount}`);
    // console.log(`Average moves: ${avgMoveCount}`);

    expect(minMoveCount).toBeGreaterThanOrEqual(37);
    expect(maxMoveCount).toBeLessThan(80);
    expect(avgMoveCount).toBeLessThan(64);
    expect(avgMoveCount).toBeGreaterThan(55);
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
