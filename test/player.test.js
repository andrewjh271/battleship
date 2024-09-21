import gameBoardFactory from '../src/gameboard';
import { humanPlayerFactory, computerPlayerFactory } from '../src/player';

describe('attacking', () => {
  test('players can attack', () => {
    const opponentBoard = gameBoardFactory();
    const player = humanPlayerFactory(null, opponentBoard);
    player.attack([4, 4]);
    expect(opponentBoard.squares[4][4].attacked).toBe(true);
  })
  
  test('computers can randomly attack unoccupied squares', () => {
    const opponentBoard = gameBoardFactory();
    const computer = computerPlayerFactory(null, opponentBoard);
    for (let i = 0; i < 100; i++) {
      computer.attack();
    }
    expect(() => computer.attack().toThrow('there are no moves left'));
  })
})

describe('placing ships', () => {
  test('players can place ships', () => {
    const homeBoard = gameBoardFactory();
    const player = humanPlayerFactory(homeBoard);
    player.placeShip([[3, 4], [4, 4], [5, 4], [6, 4]]);
    expect(homeBoard.squares[3][4].ship).toBe(homeBoard.squares[6][4].ship);
  })

  test('computers place all ships at once', () => {
    const homeBoard = gameBoardFactory();
    const DOMBoard = { 
      placeSetImages() {}
    }
    const computer = computerPlayerFactory(homeBoard, null, DOMBoard );
    computer.setup();
    let totalShipArea = 0;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (homeBoard.squares[i][j].ship) {
          totalShipArea++;
        }
      }
    }
    expect(totalShipArea).toBe(37);
  })
})