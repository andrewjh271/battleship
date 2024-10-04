import boardFactory from './board';
import { humanPlayerFactory, computerPlayerFactory } from './player';
import { DOMBoardFactory } from './DOMBoard';
import { showBoards, setBoardSizes } from './DOMController';
import { rowLength } from './boardSize';
import { on } from './observer';
import { setEnsemble } from './ensemble';

const startButton = document.querySelector('.start-game');
const setBoardButton = document.querySelector('.set-board');
const switchButton = document.querySelector('.switch-turns');
const startRoundButton = document.querySelector('.start-round');
const curtain = document.querySelector('.curtain');

startButton.addEventListener('click', beginSetup);
switchButton.addEventListener('click', coverBoards);

let player1;
let player2;
let currentPlayer;

let DOMBoard1;
let DOMBoard2;

let attackCount = 0;
const attackMax = 3;

function playerAttackProgression() {
  if (currentPlayer.sunkAllShips()) {
    gameOver();
    return;
  }
  attackCount++;
  if (attackCount >= attackMax) {
    attackCount = 0;
    switchTurns();
    finishRound();
  }
}

function beginSetup() {
  setBoardSizes();
  setEnsemble();
  const board1 = boardFactory('board1');
  const board2 = boardFactory('board2');
  DOMBoard1 = DOMBoardFactory('board1', rowLength());
  DOMBoard2 = DOMBoardFactory('board2', rowLength());
  player1 = humanPlayerFactory(board1, board2, DOMBoard1, DOMBoard2);
  player2 = document.getElementById('computer').checked
    ? computerPlayerFactory(board2, board1, DOMBoard2)
    : (player2 = humanPlayerFactory(board2, board1, DOMBoard2, DOMBoard1));
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
  on('attack', playerAttackProgression); // must be after 'attack' subscription from board.js
  DOMBoard1.listenForAttack();
  DOMBoard2.listenForAttack();
  currentPlayer = player1;
  if (player2.isComputer()) {
    playRound();
  } else {
    coverBoards();
  }
}

function finishRound() {
  if (player2.isComputer()) {
    playRound();
  } else {
    DOMBoard1.disable();
    DOMBoard2.disable();
    switchButton.disabled = false;
  }
}

function coverBoards() {
  curtain.classList.remove('hidden');
}
startRoundButton.addEventListener('click', playRound);

function playRound() {
  curtain.classList.add('hidden');
  switchButton.disabled = true;
  currentPlayer.setTurn();
  if (currentPlayer.isComputer()) {
    computerAttacks();
  }
}

function computerAttacks(i = 0) {
  if (i >= attackMax) {
    switchTurns();
    setTimeout(() => playRound(), 500);
    return;
  }

  setTimeout(() => {
    currentPlayer.attack();
    if (currentPlayer.sunkAllShips()) {
      gameOver();
      return;
    }
    computerAttacks(i + 1);
  }, 500);
}

function switchTurns() {
  currentPlayer = currentPlayer === player1 ? player2 : player1;
}

function gameOver() {
  const name = currentPlayer === player1 ? 'Player 1' : 'Player 2';
  console.log(name, 'is the winner');

  DOMBoard1.setGameOver();
  DOMBoard2.setGameOver();
}
