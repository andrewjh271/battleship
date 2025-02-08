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
        cello: [2, 5],
        horn: [2, 2],
        violin: [1, 3],
        clarinet: [1, 3],
        flute: [1, 3],
      };
      break;
    case 'brass':
      ensemble = {
        tuba: [2, 3],
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
        oboe: [1, 3],
        piccolo: [1, 2],
      };
      break;
    case 'strings':
      ensemble = {
        bass: [3, 6],
        cello: [2, 5],
        viola: [1, 3],
        violin: [1, 3]
      };
      break;
    case 'harp':
      ensemble = {
        harp: [3, 6]
      };
      break;
    case 'percussion':
      ensemble = {
        bassdrum: [3, 4],
        glockenspiel: [3, 2],
        cymbals: [2, 2],
        snare: [2, 2],
        cabasa: [2, 1],
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
