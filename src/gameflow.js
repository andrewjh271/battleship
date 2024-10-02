import boardFactory from './board';
import { humanPlayerFactory, computerPlayerFactory } from './player';
import { DOMBoardFactory } from './DOMBoard';
import { showBoards, setBoardSizes } from './DOMController';
import { rowLength } from './boardSize';
import { on } from './observer';
import { setEnsemble } from './ensemble';

const startButton = document.querySelector('.start-game');
startButton.addEventListener('click', beginSetup);
const setBoardButton = document.querySelector('.set-board');

let player1;
let player2;

let board1; // eventually declare inside beginSetup?
let board2; // eventually declare inside beginSetup?

let DOMBoard1;
let DOMBoard2;

let playerOneToMove = true;
let attackCount = 0;
const attackMax = 3;
on('attack', () => {
  attackCount++;
  if (attackCount >= attackMax) {
    attackCount = 0;
    playerOneToMove = !playerOneToMove
    setTimeout(() => playRound(playerOneToMove), 2000);
  }
});

function beginSetup() {
  setBoardSizes();
  setEnsemble();
  board1 = boardFactory('board1');
  board2 = boardFactory('board2');
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
  playRound(playerOneToMove);
}

function playRound(firstPlayer) {
  console.log('play round');
  if (firstPlayer) {
    DOMBoard1.setOffense();
    DOMBoard2.setDefense();
  } else if (player2.isComputer()) {
    DOMBoard1.setDefense();
    DOMBoard2.setOffense();
    computerAttacks();
  } else {
    DOMBoard2.setOffense();
    DOMBoard1.setDefense();
  }
}

function computerAttacks(i = 0) {
  if (i >= attackMax) {
    playerOneToMove = !playerOneToMove;
    playRound(playerOneToMove);
    return;
  }

  setTimeout(() => {
    player2.attack();
    computerAttacks(i + 1);
  }, 2000)
}
