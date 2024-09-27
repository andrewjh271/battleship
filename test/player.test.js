import boardFactory from '../src/board';
import { humanPlayerFactory, computerPlayerFactory } from '../src/player';
import { rowLength } from '../src/boardSize';
import { getEnsemble } from '../src/ensemble';

describe('attacking', () => {
  test('players can attack', () => {
    const opponentBoard = boardFactory();
    const player = humanPlayerFactory(null, opponentBoard);
    player.attack([4, 4]);
    expect(opponentBoard.squares[4][4].attacked).toBe(true);
  });

  test('computers can randomly attack unoccupied squares', () => {
    const opponentBoard = boardFactory();
    const computer = computerPlayerFactory(null, opponentBoard);
    for (let i = 0; i < 100; i++) {
      computer.attack();
    }
    expect(() => computer.attack().toThrow('there are no moves left'));
  });
});

describe('placing ships', () => {
  test('players can place ships', () => {
    const homeBoard = boardFactory();
    const player = humanPlayerFactory(homeBoard);
    player.placeShip([
      [3, 4],
      [4, 4],
      [5, 4],
      [6, 4],
    ]);
    expect(homeBoard.squares[3][4].ship).toBe(homeBoard.squares[6][4].ship);
  });

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
