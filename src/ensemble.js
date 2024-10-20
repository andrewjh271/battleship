let ensemble = {
  cello: [2, 5],
  trombone: [1, 5],
  bassoon: [1, 4],
  horn: [2, 2],
  flute: [1, 3],
  clarinet: [1, 3],
  violin: [1, 3],
  trumpet: [1, 3],
  piccolo: [1, 2],
};

function setEnsemble() {
  const ensembleInput = document.querySelector('.ensemble-select');
  const selection = ensembleInput.value;

  switch (selection) {
    case 'chamber':
      ensemble = {
        // cello: [2, 5],
        // horn: [2, 2],
        violin: [1, 3],
        // clarinet: [1, 3],
        // flute: [1, 3],
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
        bassoon: [1, 4],
        flute: [1, 3],
        clarinet: [1, 3],
        piccolo: [1, 2],
      };
      break;
    default:
      ensemble = {
        cello: [2, 5],
        trombone: [1, 5],
        bassoon: [1, 4],
        horn: [2, 2],
        flute: [1, 3],
        clarinet: [1, 3],
        violin: [1, 3],
        trumpet: [1, 3],
        piccolo: [1, 2],
      };
  }
}

function getEnsemble() {
  return ensemble;
}

export { setEnsemble, getEnsemble };
