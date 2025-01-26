const modeSelect = document.querySelector('#mode');
let mode = 'standard';

function setMode() {
  mode = modeSelect.value;
}

function getMode() {
  return mode;
}

export {
  setMode,
  getMode
}