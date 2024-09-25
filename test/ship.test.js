import shipFactory from '../src/ship';

test('returns an object', () => {
  expect(shipFactory()).toBeInstanceOf(Object);
});

test('ships can be hit as many times as their length', () => {
  const ship = shipFactory(4);
  ship.hit();
  ship.hit();
  ship.hit();
  ship.hit();
  expect(() => ship.hit()).toThrow('You already sank this ship!');
});

test('determines whether a ship is sunk', () => {
  const ship = shipFactory(3);
  ship.hit();
  expect(ship.isSunk()).toBeFalsy();
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBeTruthy();
});

test('can have a name', () => {
  const ship = shipFactory(3, 'Submarine');
  expect(ship.name).toBe('Submarine');
});

test('ships know their coordinates', () => {
  const ship = shipFactory(4, 'A Great Ship', [
    [3, 1],
    [4, 1],
    [5, 1],
    [6, 1],
  ]);
  expect(ship.coords).toEqual([
    [3, 1],
    [4, 1],
    [5, 1],
    [6, 1],
  ]);
});
