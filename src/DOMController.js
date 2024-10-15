import { setRowLength } from "./boardSize";
import { getEnsemble } from "./ensemble";

const board1 = document.querySelector('#board1');
const board2 = document.querySelector('#board2');
const setupContainer = document.querySelector('.board-setup-container');
const controlPanel = document.querySelector('.control-panel');
const curtains = document.querySelectorAll('.curtain');
const stagingArea = document.querySelector('.staging-area');

function resetDOM() {
  board1.classList.add('hidden');
  board2.classList.add('hidden');
  board1.classList.remove('defense');
  board2.classList.remove('defense');
  board1.classList.remove('offense');
  board2.classList.remove('offense');
  setupContainer.classList.add('hidden');
  controlPanel.classList.remove('setup');
  controlPanel.classList.remove('in-game');
  controlPanel.classList.remove('two-player')
  controlPanel.classList.add('preferences');
  curtains.forEach(curtain => curtain.classList.add('invisible'));

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
  previews.forEach(preview => {
    if (whiteList.includes(preview.id)) {
      preview.classList.remove('hidden');
    } else {
      preview.classList.add('hidden');
    }
  })
}

function showBoards() {
  board1.classList.remove('hidden');
  board2.classList.remove('hidden');
  setupContainer.classList.add('hidden');
}

function setBoardSizes() {
  const rowLength = Number(document.querySelector('.size-select').value) || 10
  setRowLength(rowLength);
  board1.style.gridTemplateColumns = `repeat(${rowLength}, 1fr)`
  board1.style.gridTemplateRows = `repeat(${rowLength}, 1fr)`
  board2.style.gridTemplateColumns = `repeat(${rowLength}, 1fr)`
  board2.style.gridTemplateRows = `repeat(${rowLength}, 1fr)`
}

function setSetupView() {
  setBoardSizes();
  controlPanel.classList.remove('preferences');
  controlPanel.classList.add('setup');
}

function setGameView() {
  controlPanel.classList.remove('setup');
  controlPanel.classList.add('in-game');
}

export { showBoards, showSetup, setSetupView, setGameView, resetDOM };
