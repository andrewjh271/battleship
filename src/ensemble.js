let ensemble = {
  flute: [1, 3],
  trombone: [1, 5],
  clarinet: [1, 3],
  violin: [1, 3],
  bassoon: [1, 4],
  cello: [2, 5],
  horn: [2, 2],
  piccolo: [1, 2],
  trumpet: [1, 3],
};

function setEnsemble() {
  const ensembleInput = document.querySelector('.ensemble-select');
  const selection = ensembleInput.value;

  switch (selection) {
    case 'chamber':
      ensemble = {
        violin: [1, 3],
        clarinet: [1, 3],
        cello: [2, 5],
        horn: [2, 2],
        flute: [1, 3],
      };
      break;
    case 'brass':
      ensemble = {
        trombone: [1, 5],
        horn: [2, 2],
        trumpet: [1, 3],
      };
      break;
    case 'woodwinds':
      ensemble = {
        flute: [1, 3],
        clarinet: [1, 3],
        bassoon: [1, 4],
        piccolo: [1, 2],
      };
      break;
    default:
      // keep as is
  }
}

function getEnsemble() {
  return ensemble;
}

export { setEnsemble, getEnsemble };
