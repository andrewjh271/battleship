import boardFactory from './board';
import { humanPlayerFactory, computerPlayerFactory } from './player';
import { DOMBoardFactory } from './DOMBoard';
import { showBoards, setBoardSizes } from './DOMController';
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

let DOMBoard1;
let DOMBoard2;

function beginSetup() {
  setBoardSizes();
  setEnsemble();
  board1 = boardFactory();
  board2 = boardFactory();
  DOMBoard1 = DOMBoardFactory('board1', rowLength());
  DOMBoard2 = DOMBoardFactory('board2', rowLength());
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
  showBoards();
  DOMBoard1.setOffense();
  DOMBoard2.setDefense();
  board1.unsubscribeAttack();
  board2.subscribeAttack();

  emit('setPosition', 34); // testing that this has been unsubscribed
}
