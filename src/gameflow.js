/* eslint-disable no-return-assign */
import boardFactory from './board';
import { humanPlayerFactory, computerPlayerFactory } from './player';
import { DOMBoardFactory } from './DOMBoard';
import {
  showBoards,
  setSetupPanelView,
  setGamePanelView,
  resetDOM,
  updateFleet,
  coverBoards,
  coverFleets,
  setPlayRoundView,
  setBoardSizes,
  showInfoButtons,
  broadcastSunkShip,
  broadcastWin,
  addResetGlow,
} from './DOMController';
import { rowLength } from './boardSize';
import { on, emit, removeAllEvents } from './observer';
import { removeWindowEvents } from './imageGenerator';
import { setEnsemble } from './ensemble';
import { moveTrackerFactory } from './moveTracker';
import { setMode } from './mode';
import { subscribeToEvents as setupSfxSubscriptions } from './audioEffects';
import {
  startMusic,
  stopMusic,
  removeInstrument,
  resetRemovedInstruments,
  preloadMusicBuffers,
} from './music';

const controlPanel = document.querySelector('.control-panel');
const startButton = document.querySelector('.start-game');
const setBoardButton = document.querySelector('.set-board');
const switchButton = document.querySelector('.switch-turns');
const startRoundButton = document.querySelector('.start-round');
const attackDirection = document.querySelector('.attack-direction');
const gameState = document.querySelector('.game-state');

const resetButton = document.querySelector('.reset');
resetButton.addEventListener('click', reset);

startButton.addEventListener('click', beginSetup);
switchButton.addEventListener('click', coverBoards);
switchButton.addEventListener('click', coverFleets);
startRoundButton.addEventListener('click', playRound);

const moveTracker1 = moveTrackerFactory('moves1');
const moveTracker2 = moveTrackerFactory('moves2');

const autoSetupButtonSimple = document.querySelector('.random');
const autoSetupButton = document.querySelector('.random-enhanced');

let player1;
let player2;
let currentPlayer;

let DOMBoard1;
let DOMBoard2;

let attackCount = 0;
let attackMax = 3;
const computerMoveTime = 700;

let sinkDelay = 0; // delay computer start if last move sank a ship

function beginSetup() {
  setEnsemble();
  setSetupPanelView();
  setBoardSizes();
  setMode();
  preloadMusicBuffers();
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
  autoSetupButtonSimple.addEventListener('click', player1.autoSetupSimple);
  autoSetupButton.addEventListener('click', player1.autoSetup);
  setBoardButton.addEventListener('click', finishSetup, { once: true });
}

function finishSetup() {
  autoSetupButtonSimple.removeEventListener('click', player1.autoSetupSimple);
  autoSetupButton.removeEventListener('click', player1.autoSetup);
  player2.setup();
  if (player2.isComputer()) {
    startGame();
  } else {
    controlPanel.classList.add('two-player');
    autoSetupButtonSimple.addEventListener('click', player2.autoSetupSimple);
    autoSetupButton.addEventListener('click', player2.autoSetup);
    setBoardButton.addEventListener('click', startGame, { once: true });
  }
}

function startGame() {
  setGamePanelView();
  showInfoButtons();
  moveTracker1.reset(attackMax);
  moveTracker2.reset(attackMax);
  on('sunk', setSinkDelay);
  on('sunk', updateFleet);
  on('sunk', broadcastSunkShip);
  on('sunk', removeInstrument);
  on('attack', postAttackContinuation); // must be after 'attack' subscription from board.js; (computer attack does not emit this event)
  on('game-over', broadcastWin);
  on('game-over', addResetGlow);
  setupSfxSubscriptions();
  startMusic();
  currentPlayer = player1;
  moveTracker1.show();
  if (player2.isComputer()) {
    playRound();
    showBoards();
    DOMBoard1.listenForAttack();
    DOMBoard2.listenForAttack();
  } else {
    coverBoards();
    setTimeout(() => {
      showBoards();
      currentPlayer.setTurn();
      DOMBoard1.listenForAttack();
      DOMBoard2.listenForAttack();
    }, 2000); // wait for curtain to fully cover boards before changing setup-board to board1
  }
}

function playRound() {
  setPlayRoundView();
  currentPlayer.setTurn();
  if (currentPlayer.isComputer()) {
    resetButton.disabled = true;
    setTimeout(() => {
      resetButton.disabled = false;
    }, attackMax * computerMoveTime + 1800 + sinkDelay);
    setTimeout(switchMoveTracker, 500);
    setTimeout(computerAttacks, 1000 + sinkDelay);
  } else {
    switchMoveTracker();
  }
}

function postAttackContinuation() {
  // only runs after a player's attack, not the computer's
  currentPlayer.incrementMoveCounter();
  if (currentPlayer.sunkAllShips()) {
    gameOver();
    return;
  }
  attackCount++;
  if (attackCount >= attackMax) {
    attackCount = 0;
    if (!player2.isComputer()) {
      attackDirection.classList.add('opaque');
    }
    switchTurns();
    finishRound();
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
    attackDirection.classList.remove('player2');
    if (player2.isComputer()) {
      attackDirection.classList.remove('computer');
    }
  } else {
    moveTracker1.hide();
    moveTracker2.show();
    attackDirection.classList.add('player2');
    if (player2.isComputer()) {
      attackDirection.classList.add('computer');
    }
  }
}

function setSinkDelay() {
  sinkDelay = 700;
  setTimeout(() => (sinkDelay = 0), 1000);
}

function gameOver() {
  gameState.textContent = 'Wins!';
  const playerID = currentPlayer === player1 ? 1 : 2;
  emit('game-over', playerID);
  DOMBoard1.setGameOver();
  DOMBoard2.setGameOver();
}

function reset() {
  resetDOM();
  removeAllEvents();
  removeWindowEvents();
  attackCount = 0;
  DOMBoard1.unlistenForAttack();
  DOMBoard2.unlistenForAttack();
  setBoardButton.removeEventListener('click', finishSetup, { once: true });
  setBoardButton.removeEventListener('click', startGame, { once: true });
  autoSetupButtonSimple.removeEventListener('click', player1.autoSetupSimple);
  autoSetupButton.removeEventListener('click', player1.autoSetup);
  autoSetupButtonSimple.removeEventListener('click', player2.autoSetupSimple);
  autoSetupButton.removeEventListener('click', player2.autoSetup);
  stopMusic();
  resetRemovedInstruments();
}
