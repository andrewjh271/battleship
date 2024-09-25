import { initialize, start } from '../src/game';

test('initialize creates players and boards', () => {
  const [p1, p2, b1, b2] = initialize();
  expect(p1).toHaveProperty('attack');
  expect(p2).toHaveProperty('attack');
  expect(b1).toHaveProperty('placeShip');
  expect(b2).toHaveProperty('placeShip');
});

describe.skip('gameplay', () => {
  test('plays through a game', () => {
    expect(start()).toMatch(/Player [12] Wins/);
  });
});
