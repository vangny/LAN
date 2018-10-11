const express = require('express');
const bodyparser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const iconv = require('iconv-lite');
const encodings = require('iconv-lite/encodings');

iconv.encodings = encodings;

const { schema } = require('./schema');

const PORT = process.env.PORT || 9000;
// const pubsub = new PubSub();

const app = express();

app.use(bodyparser.json());
app.use(express.static(`${__dirname}/../client/dist`));
// app.use(express.static(`${__dirname}, "jsx"`));
app.use('/graphql', bodyparser.json(), graphqlExpress({
  schema,
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`,
}));

module.exports = app;
