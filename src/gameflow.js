import boardFactory from './board';
import { humanPlayerFactory, computerPlayerFactory } from './player';
import { DOMBoardFactory } from './DOMBoard';
import { showBoards, setBoardSizes, setTurn } from './DOMController';
import { rowLength } from './boardSize';
import { emit } from './observer';
import { setEnsemble } from './ensemble';

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
  setBoardSizes();
  setEnsemble();
  board1 = boardFactory();
  board2 = boardFactory();
  const DOMBoard1 = DOMBoardFactory('board1', rowLength());
  const DOMBoard2 = DOMBoardFactory('board2', rowLength());
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
  setTurn('player1');

  emit('setPosition', 34); // testing that this has been unsubscribed
}
