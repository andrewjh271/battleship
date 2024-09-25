import boardFactory from './board';
import { humanPlayerFactory, computerPlayerFactory } from './player';

function initialize(p1, p2) {
  const board1 = boardFactory();
  const board2 = boardFactory();
  const player1 = p1 === 'human' ? humanPlayerFactory() : computerPlayerFactory(board1, board2);
  const player2 = p2 === 'human' ? humanPlayerFactory() : computerPlayerFactory(board2, board1);
  return [player1, player2, board1, board2];
}

function start(p1, p2) {
  const [player1, player2, gameBoard1, gameBoard2] = initialize(p1, p2);
  player1.setup();
  player2.setup();
  const result = play(player1, player2, gameBoard1, gameBoard2);
  return result;
}

function play(player1, player2, board1, board2) {
  while (true) {
    player1.attack();
    if (board2.gameOver()) {
      return 'Player 1 Wins';
    }
    player2.attack();
    if (board1.gameOver()) {
      return 'Player 2 Wins';
    }
  }
}

export { initialize, start };
