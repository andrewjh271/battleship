export default function shipFactory(length, name, coordinateSet) {
  let hits = 0;
  const coords = coordinateSet;
  const hit = () => {
    if (hits < length) {
      hits++;
    } else {
      throw new Error('You already sank this ship!');
    }
  };
  const isSunk = () => hits === length;
  return { hit, isSunk, name, coords };
}
