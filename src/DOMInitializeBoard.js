/* eslint-disable no-param-reassign */
function createGrid(rows, board) {
  // HTML element remains after a reset; revert back to initial state
  const children = Array.from(board.children);
  children.forEach((node) => {
    if (node.classList.contains('permanent')) {
      return;
    }
    node.remove();
  });

  board.cells = [];
  for (let i = 0; i < rows * rows; i++) {
    board.cells[i] = document.createElement('div');
    board.cells[i].classList.add('cell');
    board.cells[i].style.gridArea = `${Math.floor(i / rows) + 1} / ${(i % rows) + 1} / span 1 / span 1`;
    board.cells[i].dataset.index = i;
    board.appendChild(board.cells[i]);
  }
}

function initializeDOMBoard(id, rows) {
  const board = document.getElementById(id);
  board.numRows = rows;
  createGrid(rows, board);
  return board;
}

export { initializeDOMBoard };
