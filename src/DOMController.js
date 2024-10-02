import { setRowLength } from "./boardSize";
import { getEnsemble } from "./ensemble";

// const startButton = document.querySelector('start-game');
// startButton.addEventListener('click', setupBoard1)

const board1 = document.querySelector('#board1');
const board2 = document.querySelector('#board2');

function showSetup(board) {
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
  const setupContainer = document.querySelector('.board-setup-container');
  board1.classList.remove('hidden');
  board2.classList.remove('hidden');
  setupContainer.classList.add('hidden');
}

function setBoardSizes() {
  // eventually based on window size
  const rowLength = 10;
  setRowLength(rowLength);
  board1.style.gridTemplateColumns = `repeat(${rowLength}, 1fr)`
  board1.style.gridTemplateRows = `repeat(${rowLength}, 1fr)`
  board2.style.gridTemplateColumns = `repeat(${rowLength}, 1fr)`
  board2.style.gridTemplateRows = `repeat(${rowLength}, 1fr)`
}

export { showBoards, setBoardSizes, showSetup };
