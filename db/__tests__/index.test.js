describe('Test the getAlerts method', () => {
  beforeAll(() => {
      mongoDB.connect();
  });
  afterAll((done) => {
      mongoDB.disconnect(done);
  });
}