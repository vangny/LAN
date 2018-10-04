
const request = require('supertest');
const db = require('../../db/index');
const app = require('../app');
const sum = require('../sum');
// pass in the files you want to test here
// const sequelize = new Sequelize(`${process.env.DB_URL}`);

// beforeEach(() => {
//   sequelize.authenticate()
//     .then(() => {
//       console.log('Test suite: connecting to db...');
//     });
// });

// afterEach(() => {
//   console.log('Test suite: disconnecting...');
//   sequelize.disconnect();
// });

describe('Testing all GET & POST requests', () => {
  afterAll(() => {
    db.removeLastAlert();
  });

  test('It should response GET method', () => (
    request(app).get('/home').expect(200)));
  test('It should response post events method', () => (
    request(app).post('/alert/api/events').expect(200)));
  test('It should response post alerts method', () => (
    request(app).post('/alert/api/alerts').expect(201)));
});

// describe('Test the home path', () => {
//   test('It should response the GET method', () => (
//     request(app).get('/home').expect(200)));
// });

// describe('Test the events path', () => {
//   test('It should response post method', () => (
//     request(app).post('/alert/api/events').expect(200)));
// });

// describe('Test the events path', () => {
//   test('It should response post method', () => (
//     request(app).post('/alert/api/alerts').expect(201)));
// });


// test
describe('Test sum function', () => {
  test('It should properly sum two numbers', () => (
    expect(sum(1, 2)).toBe(3)));
})
