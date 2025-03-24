/* eslint-disable no-param-reassign */
import { coordinatesToIndex, indexToCoordinates } from './coordinates';
import { rowLength } from './boardSize';

function selectMove(distribution) {
  const keys = Object.keys(distribution);
  if (keys.length === 0) throw new Error('Distribution object is empty');
  let max = -Infinity;
  let candidateMoves = [];

  keys.forEach((key) => {
    if (distribution[key] > max) {
      candidateMoves = [key];
      max = distribution[key];
    } else if (distribution[key] === max) {
      candidateMoves.push(key);
    }
  });

  candidateMoves = candidateMoves.map((el) => indexToCoordinates(Number(el)));
  const index = Math.floor(Math.random() * candidateMoves.length);
  const move = candidateMoves[index];
  return move;
}

function huntDistribution(board, unweighted) {
  if (Object.keys(board.remainingShips).length === 0)
    throw new Error('There are no remaining ships to test');
  const sets = [];
  Object.entries(board.remainingShips).forEach((ship) => {
    const dimensions = ship[1];
    const set = board.findSets(board.containsAttack, ...dimensions);
    sets.push(...set);
  });
  const distribution = sets.flat().reduce((freq, coords) => {
    const key = coordinatesToIndex(coords);
    freq[key] = (freq[key] || 0) + 1;
    return freq;
  }, {});
  return unweighted ? distribution : weightEdges(distribution);
}

function weightEdges(distribution) {
  const keys = Object.keys(distribution);
  if (keys.length === 0) throw new Error('Distribution object is empty');

  const avg = getAverage(distribution);
  const weight = Math.floor(Math.random() * avg * 1.6);
  const weightedDistribution = {};

  keys.forEach((key) => {
    weightedDistribution[key] = distribution[key] + (isEdge(key) ? weight : 0);
  });
  return weightedDistribution;
}

function getAverage(distribution) {
  const keys = Object.keys(distribution);
  let total = 0;
  keys.forEach((key) => {
    total += distribution[key];
  });
  return total / keys.length;
}

function isEdge(index) {
  const coords = indexToCoordinates(index);
  return coords.some((coord) => coord === 0 || coord === rowLength() - 1);
}

function targetDistribution(board) {
  if (Object.keys(board.remainingShips).length === 0)
    throw new Error('There are no remaining ships to test');
  const sets = [];
  Object.entries(board.remainingShips).forEach((ship) => {
    const dimensions = ship[1];
    const set = board.findSets(board.containsMissOrSunkSquare, ...dimensions);
    sets.push(...set);
  });
  const distribution = {};
  sets.forEach((set) => {
    const n = board.numAttacksInSet(set);
    const weightedScore = 15 ** n;

    // 15 possible placements containing 1 hit square would be necessary to equal in weight 1 possible
    // placement containing 2 hit squares, and so on.
    // Designed to prioritize squares that could complete sets with the highest number of hit squares.
    // It is not clear that this offers any improvement against random placement, but against
    // human players it should. Against humans it is more likely that hit squares which could be part of
    // a large ship are, in fact, part of that ship because a human player is less likely to place ships
    // in clusters.
    set
      .filter((coords) => !board.isAttacked(coords))
      .forEach((coords) => {
        const key = coordinatesToIndex(coords);
        distribution[key] = (distribution[key] || 0) + 1 + weightedScore;
      });
  });
  return distribution;
}

export { selectMove, huntDistribution, targetDistribution, getAverage, isEdge };
