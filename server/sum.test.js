const request = require('supertest');
const sum = require('./sum');

// describe('Test the root path', () => {
//   test('It should response the GET method', () => {
//     return request(app.get('/').expect(200));
//   });
// })
test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});