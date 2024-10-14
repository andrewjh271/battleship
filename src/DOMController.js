import { setRowLength } from "./boardSize";
import { getEnsemble } from "./ensemble";

const board1 = document.querySelector('#board1');
const board2 = document.querySelector('#board2');
const setupContainer = document.querySelector('.board-setup-container');

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
    if (!whiteList.includes(preview.id)) {
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

export { showBoards, setBoardSizes, showSetup };
