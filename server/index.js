const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');

const { schema } = require('./schema');

const PORT = process.env.PORT || 9000;
const app = require('./app');

const server = createServer(app);
server.listen(PORT, (err) => {
  // console.log(`Apollo Server is now running on http://localhost:${PORT}`);
  if (err) throw err;

  new SubscriptionServer.create({
    schema,
    execute,
    subscribe,
    onConnect: () => console.log('Client connected~~~~~~'),
  },
  {
    server,
    path: '/subscriptions',
  });
});
