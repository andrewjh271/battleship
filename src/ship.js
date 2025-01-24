export default function shipFactory(area, name, coordinateSet) {
  let hits = 0;
  const coords = coordinateSet;
  const hit = () => {
    if (hits < area) {
      hits++;
    } else {
      throw new Error('You already sank this ship!');
    }
  };
  const isSunk = () => hits === area;
  return { hit, isSunk, name, coords, area };
}
