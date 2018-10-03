
const request = require('supertest');
const app = require('./app');
const sum = require('./sum');
// pass in the files you want to test here

describe('Test the root path', () => {
  test('It should response the GET method', () => (
    request(app).get('/home').expect(201)));
});


// test
describe('Test sum function', () => {
  test('It should properly sum two numbers', () => (
    expect(sum(1, 2)).toBe(3)));
})
