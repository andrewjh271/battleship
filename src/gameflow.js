import gameBoardFactory from './gameboard';
import { humanPlayerFactory, computerPlayerFactory } from './player';
import { boardFactory } from './DOMBoard';
import { showBoards } from './DOMController';

import { emit } from './observer';

const startButton = document.querySelector('.start-game');
startButton.addEventListener('click', beginSetup);
const setBoardButton = document.querySelector('.set-board');
// mouse events need to be disabled if not valid

let player1;
let player2;

let board1; // eventually declare inside beginSetup?
let board2; // eventually declare inside beginSetup?

function beginSetup() {
  console.log('setup begins...');
  board1 = gameBoardFactory();
  board2 = gameBoardFactory();
  const DOMBoard1 = boardFactory('board1', 10);
  const DOMBoard2 = boardFactory('board2', 10);
  player1 = humanPlayerFactory(board1, board2, DOMBoard1);
  player2 = computerPlayerFactory(board2, board1, DOMBoard2);

  player1.setup();
  setBoardButton.addEventListener('click', finishSetup, { once: true });
}

function finishSetup() {
  player2.setup();
  if (player2.isComputer()) {
    startGame();
  } else {
    setBoardButton.addEventListener('click', startGame, { once: true });
  }
}

function startGame() {
  console.log('game starts!');
  console.log('board1...');
  console.log(board1);
  console.log('board2...');
  console.log(board2);
  showBoards();

  emit('setPosition', 34); // testing that this has been unsubscribed
}
