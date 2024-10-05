import { rowLength } from "./boardSize";

function indexToCoordinates(index) {
  const size = rowLength();
  const x = index % size;
  const y = Math.floor(index / size);
  return [x, y];
}

function coordinatesToIndex(coords) {
  const size = rowLength();
  return coords[1] * size + coords[0];
}

export { indexToCoordinates, coordinatesToIndex };
