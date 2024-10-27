import boardFactory from './board';
import { humanPlayerFactory, computerPlayerFactory } from './player';
import { DOMBoardFactory } from './DOMBoard';
import { showBoards, setSetupView, setGameView, resetDOM, updateFleet } from './DOMController';
import { rowLength } from './boardSize';
import { on, removeAllEvents } from './observer';
import { setEnsemble } from './ensemble';
import { moveTrackerFactory } from './moveTracker'

const controlPanel = document.querySelector('.control-panel');
const startButton = document.querySelector('.start-game');
const setBoardButton = document.querySelector('.set-board');
const switchButton = document.querySelector('.switch-turns');
const startRoundButton = document.querySelector('.start-round');
const curtains = document.querySelectorAll('.curtain');

const resetButton = document.querySelector('.reset');
resetButton.addEventListener('click', reset);

startButton.addEventListener('click', beginSetup);
switchButton.addEventListener('click', coverBoards);
startRoundButton.addEventListener('click', playRound);

const moveTracker1 = moveTrackerFactory('moves1');
const moveTracker2 = moveTrackerFactory('moves2');

let player1;
let player2;
let currentPlayer;

let DOMBoard1;
let DOMBoard2;

let attackCount = 0;
let attackMax = 3;
const computerMoveTime = 500;

function playerAttackProgression() {
  if (currentPlayer.sunkAllShips()) {
    gameOver();
    return;
  }
  attackCount++;
  currentPlayer.incrementMoveCounter();
  if (attackCount >= attackMax) {
    attackCount = 0;
    switchTurns();
    finishRound();
  }
}

function beginSetup() {
  setEnsemble();
  setSetupView();
  attackMax = Number(document.getElementById('move-select').value);
  const board1 = boardFactory('board1');
  const board2 = boardFactory('board2');
  DOMBoard1 = DOMBoardFactory('board1', rowLength());
  DOMBoard2 = DOMBoardFactory('board2', rowLength());
  player1 = humanPlayerFactory(board1, board2, DOMBoard1, DOMBoard2, moveTracker1);
  player2 =
    document.getElementById('opponent-select').value === 'computer'
      ? computerPlayerFactory(board2, board1, DOMBoard2, moveTracker2)
      : (player2 = humanPlayerFactory(board2, board1, DOMBoard2, DOMBoard1, moveTracker2));
  player1.setup();
  setBoardButton.addEventListener('click', finishSetup, { once: true });
}

function finishSetup() {
  player2.setup();
  if (player2.isComputer()) {
    startGame();
  } else {
    controlPanel.classList.add('two-player');
    setBoardButton.addEventListener('click', startGame, { once: true });
  }
}

function startGame() {
  setGameView();
  moveTracker1.reset(attackMax);
  moveTracker2.reset(attackMax);
  on('sunk', updateFleet);
  on('attack', playerAttackProgression); // must be after 'attack' subscription from board.js
  DOMBoard1.listenForAttack();
  DOMBoard2.listenForAttack();
  currentPlayer = player1;
  moveTracker1.show();
  if (player2.isComputer()) {
    playRound();
    showBoards();
  } else {
    coverBoards();
    setTimeout(showBoards, 2000);
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
  curtains.forEach((curtain) => curtain.classList.remove('invisible'));
  startRoundButton.disabled = false;
  switchButton.disabled = true;
  moveTracker1.hide();
  moveTracker2.hide();
}

function playRound() {
  curtains.forEach((curtain) => curtain.classList.add('invisible'));
  switchButton.disabled = true;
  startRoundButton.disabled = true;
  currentPlayer.setTurn();
  if (currentPlayer.isComputer()) {
    resetButton.disabled = true;
    setTimeout(() => {
      resetButton.disabled = false;
    }, (attackMax + 2) * computerMoveTime);
    setTimeout(switchMoveTracker, computerMoveTime);
    setTimeout(computerAttacks, computerMoveTime);
  } else {
    switchMoveTracker();
  }
}

function computerAttacks(i = 0) {
  if (i >= attackMax) {
    switchTurns();
    setTimeout(() => playRound(), computerMoveTime);
    return;
  }

  setTimeout(() => {
    currentPlayer.attack();
    if (currentPlayer.sunkAllShips()) {
      gameOver();
      return;
    }
    computerAttacks(i + 1);
  }, computerMoveTime);
}

function switchTurns() {
  currentPlayer = currentPlayer === player1 ? player2 : player1;
}

function switchMoveTracker() {
  if (currentPlayer === player1) {
    moveTracker1.show();
    moveTracker2.hide();
  } else {
    moveTracker1.hide();
    moveTracker2.show();
  }
}

function gameOver() {
  const name = currentPlayer === player1 ? 'Player 1' : 'Player 2';
  console.log(name, 'is the winner');

  DOMBoard1.setGameOver();
  DOMBoard2.setGameOver();
}

function reset() {
  resetDOM();
  removeAllEvents();
  moveTracker1.hide();
  moveTracker2.hide();
  attackCount = 0;
  DOMBoard1.unlistenForAttack();
  DOMBoard2.unlistenForAttack();
}
