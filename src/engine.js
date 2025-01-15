/* eslint-disable no-param-reassign */
import { coordinatesToIndex, indexToCoordinates } from './coordinates';

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

function huntDistribution(board) {
  if (Object.keys(board.remainingShips).length === 0) throw new Error('There are no remaining ships to test');
  const sets = [];
  Object.entries(board.remainingShips).forEach((ship) => {
    const dimensions = ship[1];
    const set = board.findSets(board.containsAttack, ...dimensions);
    sets.push(...set);
  });
  return sets.flat().reduce((freq, coords) => {
    const key = coordinatesToIndex(coords);
    freq[key] = (freq[key] || 0) + 1;
    return freq;
  }, {});
}

function targetDistribution(board) {
  if (Object.keys(board.remainingShips).length === 0) throw new Error('There are no remaining ships to test');
  const WEIGHT = 100;
  const sets = [];
  Object.entries(board.remainingShips).forEach((ship) => {
    const dimensions = ship[1];
    const set = board.findSets(board.containsMissOrSunkSquare, ...dimensions);
    sets.push(...set);
  });
  const distribution = {};
  sets.forEach((set) => {
    const weightedScore = board.numAttacksInSet(set) * WEIGHT;
    set
      .filter((coords) => !board.isAttacked(coords))
      .forEach((coords) => {
        const key = coordinatesToIndex(coords);
        distribution[key] = (distribution[key] || 0) + 1 + weightedScore;
      });
  });
  return distribution;
}

export { selectMove, huntDistribution, targetDistribution };
