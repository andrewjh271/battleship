import gameBoardFactory from '../src/gameBoard';
import { playerFactory, computerFactory } from '../src/player';

test('players can attack', () => {
  const gameBoard = gameBoardFactory();
  const player = playerFactory(gameBoard);
  player.attack([4, 4]);
  expect(gameBoard.squares[4][4].attacked).toBe(true);
})

test('computers can randomly attack unoccupied squares', () => {
  const gameBoard = gameBoardFactory();
  const computer = computerFactory(gameBoard);
  for (let i = 0; i < 1; i++) {
    computer.attack();
  }
  expect(() => computer.attack().toThrow('there are no moves left'));
})