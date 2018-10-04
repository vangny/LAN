
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

// describe('Testing all GET & POST requests', () => {

  // test('app.get(\'home\') should be called once', () => {
  //   app.get = jest.fn();
  //   request(app).get('/home').expect(200);
  // });

  // test('app.post to be called once', () => {
  //   // app.post = jest.fn();

  //   request(app).post('/alert/api/events').expect(205);
  // })
  
//   test('createAlerts should be called once', () => {
//     db.getAlerts = jest.fn();
//     db.createAlert = jest.fn();

//     request(app).post('/alert/api/alerts').expect(201);
//     // expect(db.createAlert.mock.calls.length).toBe(1);
//     expect(db.getAlerts.mock.calls.length).toBe(1);
//   });
// });

describe('Test the home path', () => {
  test('It should response the GET method', () => (
    request(app).get('/home').expect(200)));
});

// describe('Test the events path', () => {
//   test('It should response post method', () => {
//   app.post = jest.fn();
//   return request(app).post('/alert/api/events').expect(200);
//   });
// });

// describe('Test the alerts path', () => {
//   test('It should response post method', () => (
//     // app.post = jest.fn()
//     request(app).post('/alert/api/alerts').expect(201)));
// });

// Test
describe('Test sum function', () => {
  test('It should properly sum two numbers', () => (
    expect(sum(1, 2)).toBe(3)));
});
