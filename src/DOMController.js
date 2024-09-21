// import { humanPlayerFactory, computerPlayerFactory } from './player';
import { initializeBoard } from './DOMInitializeBoard';
import { setupBoard } from './DOMSetupBoard';
import { indexToCoordinates } from './coordinates';
import { start } from './game';
import { emit } from './observer';

const ROWS = 10;

// const startButton = document.querySelector('start-game');
// startButton.addEventListener('click', setupBoard1)

function showBoards() {
  const board1 = document.querySelector('#board1')
  const board2 = document.querySelector('#board2')
  const setupContainer = document.querySelector('.board-setup-container');
  board1.classList.remove('hidden');
  board2.classList.remove('hidden');
  setupContainer.classList.add('hidden');
}

function setupBoard1() {

}

// const board1 = initializeBoard('board1', ROWS);
// setupBoard(board1);

function recordBoardPositions() {
  emit('positionSet', board1)
}



function handleAttack(e) {
  const { index } = e.target.dataset;
  if (!index) return;
  console.log(indexToCoordinates(index));
}

function listenForAttack(board) {
  board.addEventListener('click', handleAttack);
}

// function unListenForAttack(board) {
//   board.removeEventListener('click', handleAttack);
// }

listenForAttack(board1);


export { showBoards }