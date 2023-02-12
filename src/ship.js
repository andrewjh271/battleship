export default function shipFactory(length) {
  let hits = 0;
  const hit = () => {
    if (hits < length) {
      hits++;
    } else {
      throw new Error('You already sank this ship!');
    }
  };
  const isSunk = () => {
    return hits === length;
  };
  return { hit, isSunk };
}
