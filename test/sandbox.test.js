import testFunction from '../src/sandbox';

test('tests a function', () => {
  expect(testFunction(4, 5)).toBe(20);
})