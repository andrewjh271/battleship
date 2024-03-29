import gameBoardFactory from '../src/gameBoard';
import { playerFactory, computerFactory } from '../src/player';

describe('attacking', () => {
  test('players can attack', () => {
    const opponentBoard = gameBoardFactory();
    const player = playerFactory(null, opponentBoard);
    player.attack([4, 4]);
    expect(opponentBoard.squares[4][4].attacked).toBe(true);
  })
  
  test('computers can randomly attack unoccupied squares', () => {
    const opponentBoard = gameBoardFactory();
    const computer = computerFactory(null, opponentBoard);
    for (let i = 0; i < 100; i++) {
      computer.attack();
    }
    expect(() => computer.attack().toThrow('there are no moves left'));
  })
})

describe('placing ships', () => {
  test('players can place ships', () => {
    const homeBoard = gameBoardFactory();
    const player = playerFactory(homeBoard);
    player.placeShip([[3, 4], [4, 4], [5, 4], [6, 4]]);
    expect(homeBoard.squares[3][4].ship).toBe(homeBoard.squares[6][4].ship);
  })

  test('computers place all ships at once', () => {
    const homeBoard = gameBoardFactory();
    const computer = computerFactory(homeBoard);
    computer.placeAllShips();
    let totalShipLength = 0;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (homeBoard.squares[i][j].ship) {
          totalShipLength++;
        }
      }
    }
    expect(totalShipLength).toBe(17);
  })
})