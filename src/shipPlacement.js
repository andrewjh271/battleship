import { getEnsembleName } from "./ensemble";
import { rowLength } from "./boardSize";

const boardSizes = {
  '7': 'small',
  '10': 'standard',
  '13': 'large'
}

const probabilities = {
  'chamber': {
    // 35% chance no shared edges allowed, 65% chance 1 shared edge allowed, etc.
    'small': [.35, .3, .2, .1, .05],
    'standard': [.9, .1],
    'large': [.95, .05]
  },
  'orchestra': {
    'small': [-Infinity],
    'standard': [.75, .1, .1, .05],
    'large': [.95, .05]
  },
  'strings': {
    'small': [-Infinity],
    'standard': [.9, .1],
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
    'standard': [.9, .1],
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

const containsNoEdge = (coordsSet) => {
  for (let i = 0; i < coordsSet.length; i++) {
    const coords = coordsSet[i];
    if (
      coords[0] === 0 ||
      coords[0] === rowLength() - 1 ||
      coords[1] === 0 ||
      coords[1] === rowLength() - 1
    ) {
      return false;
    }
  }
  return true;
};

const containsMinorityEdges = (coordsSet) => {
  let numEdges = 0;
  for (let i = 0; i < coordsSet.length; i++) {
    const coords = coordsSet[i];
    if (
      coords[0] === 0 ||
      coords[0] === rowLength() - 1 ||
      coords[1] === 0 ||
      coords[1] === rowLength() - 1
    ) {
      numEdges++;
    }
  }
  return numEdges < coordsSet.length / 2;
};

const getAdjacentSquares = (origin) => {
  const set = [
    [origin[0] + 1, origin[1]],
    [origin[0] - 1, origin[1]],
    [origin[0], origin[1] + 1],
    [origin[0], origin[1] - 1],
  ];
  return set.filter(
    (adjacent) =>
      adjacent[0] >= 0 && adjacent[0] < rowLength() && adjacent[1] >= 0 && adjacent[1] < rowLength()
  );
};

export { getMaxAdjacentSquares, containsNoEdge, containsMinorityEdges, getAdjacentSquares }