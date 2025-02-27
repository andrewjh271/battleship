import { getEnsembleName } from "./ensemble";

const boardSizes = {
  '7': 'small',
  '10': 'standard',
  '13': 'large'
}

const probabilities = {
  'chamber': {
    'small': [.35, .3, .2, .1, .05],
    'standard': [.9, .1],
    'large': [.95, .05]
  },
  'orchestra': {
    'small': [-Infinity],
    'standard': [.75, .1, .1, .5],
    'large': [.95, .05]
  },
  'strings': {
    'small': [-Infinity],
    'standard': [.9, 1],
    'large': [.95, .05]
  },
  'woodwinds': {
    'small': [.7, .2, .1],
    'standard': [.9, .1],
    'large': [.95, .05]
  },
  'brass': {
    'small': [.8, .2],
    'standard': [.9, .1],
    'large': [.95, .05]
  },
  'percussion': {
    'small': [-Infinity],
    'standard': [.9, 1],
    'large': [.95, .05]
  },
  'harp': {
    'small': [-Infinity],
    'standard': [-Infinity],
    'large': [-Infinity],
  }
}

function getMaxAdjacentSquares(size) {
  const arr = probabilities[getEnsembleName()][boardSizes[size]];

  const random = Math.random();
  let maxAdjacent;
  let cumulativeProbability = 0;
  for (let i = 0; i < arr.length; i++) {
    cumulativeProbability += arr[i];
    if (random <= cumulativeProbability) {
      maxAdjacent = i;
      break;
    }
  }
  return maxAdjacent === undefined ? Infinity : maxAdjacent;
}

export { getMaxAdjacentSquares }