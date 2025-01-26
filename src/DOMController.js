/* eslint-disable no-param-reassign */
import { setRowLength } from './boardSize';
import { getEnsemble } from './ensemble';

const controlPanel = document.querySelector('.control-panel');
const startRoundButton = document.querySelector('.start-round');

const setupContainer = document.querySelector('.board-setup-container');
const stagingArea = document.querySelector('.staging-area');

const board1 = document.querySelector('#board1');
const board2 = document.querySelector('#board2');
const fleetContainers = document.querySelectorAll('.remaining-fleet');
const fleet = document.querySelectorAll('.fleet');
const attackDirection = document.querySelector('.attack-direction');
const gameState = document.querySelector('.game-state');

const switchButton = document.querySelector('.switch-turns');
const curtains = document.querySelectorAll('.curtain');
const infoButtons = document.querySelectorAll('.info');
const intro = document.querySelector('.intro-text');

const moveTrackers = document.querySelectorAll('.moves');

const broadcast1 = board1.querySelector('.broadcast');
const broadcast2 = board2.querySelector('.broadcast');

function setWindowHeight() {
  document.body.style.height = `${window.innerHeight}px`;
}

setWindowHeight();
window.addEventListener('resize', setWindowHeight);

function resetDOM() {
  board1.classList.add('hidden');
  board2.classList.add('hidden');
  board1.classList.remove('defense');
  board2.classList.remove('defense');
  board1.classList.remove('offense');
  board2.classList.remove('offense');
  board1.classList.remove('game-over');
  board2.classList.remove('game-over');
  setupContainer.classList.add('hidden');
  controlPanel.classList.remove('setup');
  controlPanel.classList.remove('in-game');
  controlPanel.classList.remove('two-player');
  controlPanel.classList.add('preferences');
  curtains.forEach((curtain) => curtain.classList.add('invisible'));
  fleetContainers.forEach((container) => {
    container.classList.add('invisible');
    container.classList.add('opaque');
    container.classList.remove('active');
  });
  fleet.forEach((instrument) => instrument.classList.remove('sunk'));
  attackDirection.classList.add('invisible');
  attackDirection.classList.remove('player2');
  broadcast1.classList.remove('game-over');
  broadcast2.classList.remove('game-over');
  broadcast1.classList.remove('active');
  broadcast2.classList.remove('active');
  gameState.textContent = 'Attack!';
  moveTrackers.forEach((tracker) => tracker.classList.add('invisible'));
  infoButtons.forEach((button) => {
    button.classList.add('hidden');
    button.textContent = 'info';
  });
  stagingArea.innerHTML = '';
}

function showSetup(board) {
  setupContainer.classList.remove('hidden');
  board.classList.remove('hidden');
  if (board1 === board) {
    board2.classList.add('hidden');
  } else {
    board1.classList.add('hidden');
  }
  const previews = document.querySelectorAll('.img-preview');
  const whiteList = Object.keys(getEnsemble());
  previews.forEach((preview) => {
    if (whiteList.includes(preview.dataset.inst)) {
      preview.classList.remove('hidden');
    } else {
      preview.classList.add('hidden');
    }
  });
}

function setBoardSizes() {
  const rowLength = Number(document.querySelector('.size-select').value) || 10;
  setRowLength(rowLength);
  board1.style.gridTemplateColumns = `repeat(${rowLength}, 1fr)`;
  board1.style.gridTemplateRows = `repeat(${rowLength}, 1fr)`;
  board2.style.gridTemplateColumns = `repeat(${rowLength}, 1fr)`;
  board2.style.gridTemplateRows = `repeat(${rowLength}, 1fr)`;
}

function showBoards() {
  setupContainer.classList.add('hidden');
  board1.classList.remove('hidden');
  board2.classList.remove('hidden');
  setTimeout(() => fleetContainers.forEach((container) => container.classList.remove('invisible')), 50);
  const whiteList = Object.keys(getEnsemble());
  fleet.forEach((instrument) => {
    if (whiteList.includes(instrument.dataset.inst)) {
      instrument.classList.remove('hidden');
    } else {
      instrument.classList.add('hidden');
    }
  });
}

function setPlayRoundView() {
  curtains.forEach((curtain) => curtain.classList.add('invisible'));
  uncoverFleets();
  attackDirection.classList.remove('invisible');
  attackDirection.classList.remove('opaque');
  switchButton.disabled = true;
  startRoundButton.disabled = true;
}

function updateFleet(data) {
  const targetContainer = data.id === 'board1' ? board1 : board2;
  const target = targetContainer.querySelector(`.${data.inst}`);
  target.classList.add('sunk');
}

function coverBoards() {
  curtains.forEach((curtain) => curtain.classList.remove('invisible'));
  setTimeout(() => {
    startRoundButton.disabled = false;
  }, 2000);
  switchButton.disabled = true;
  moveTrackers.forEach((tracker) => tracker.classList.add('hidden'));
  fleetContainers.forEach((container) => container.classList.remove('active'));
  infoButtons.forEach((button) => {
    button.textContent = 'info';
  });
}

function coverFleets() {
  fleetContainers.forEach((container) => container.classList.add('opaque'));
}

function uncoverFleets() {
  fleetContainers.forEach((container) => container.classList.remove('opaque'));
}

function setSetupPanelView() {
  intro.classList.add('hidden');
  controlPanel.classList.remove('preferences');
  controlPanel.classList.add('setup');
}

function setGamePanelView() {
  controlPanel.classList.remove('setup');
  controlPanel.classList.add('in-game');
}

function showInfoButtons() {
  infoButtons.forEach((button) => button.classList.remove('hidden'));
}

infoButtons.forEach((button) =>
  button.addEventListener('click', () => {
    const currentIcon = button.textContent;
    button.textContent = currentIcon === 'info' ? 'cancel' : 'info';

    const targetBoard = button.dataset.board === '1' ? board1 : board2;
    const targetFleetContainer = targetBoard.querySelector('.remaining-fleet');
    targetFleetContainer.classList.toggle('active');
  })
);

function broadcastSunkShip(data) {
  const broadcast = data.id === 'board1' ? broadcast1 : broadcast2;
  broadcast.textContent = `${broadcast.dataset.player}'s ${data.inst} has been sunk!`;
  broadcast.classList.add('active');
  setTimeout(() => broadcast.classList.remove('active'), 2000);
}

function broadcastWin(id) {
  const broadcast = id === 1 ? broadcast1 : broadcast2;
  broadcast.textContent = `${broadcast.dataset.player} Wins!`;
  broadcast.classList.add('game-over');
  broadcast.classList.add('active');
}

export {
  showBoards,
  showSetup,
  setBoardSizes,
  setPlayRoundView,
  setSetupPanelView,
  setGamePanelView,
  resetDOM,
  coverBoards,
  updateFleet,
  coverFleets,
  uncoverFleets,
  showInfoButtons,
  broadcastSunkShip,
  broadcastWin
};
