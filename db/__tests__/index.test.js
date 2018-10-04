const sum = require('../../server/sum');

// test
describe('Test sum function', () => {
  test('It should properly sum two numbers', () => (
    expect(sum(1, 2)).toBe(3)));
});
