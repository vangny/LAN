const express = require('express');
const expressStaticGzip = require('express-static-gzip');
const bodyparser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const iconv = require('iconv-lite');
const encodings = require('iconv-lite/encodings');
const axios = require('axios');
const cors = require('cors');
const db = require('../db/index');

iconv.encodings = encodings;

const { schema } = require('./schema');

const PORT = process.env.PORT || 9000;
// const pubsub = new PubSub();

const app = express();

app.use('/', expressStaticGzip(`${__dirname}/../client/dist`));

app.use(bodyparser.json());
// app.use(express.static(`${__dirname}/../client/dist`));
// app.use(express.static(`${__dirname}, "jsx"`));

// note change back to app.use after tests
app.post('api/tracker', (req, res) => {
  console.log('DATA RECEIVED 555 in the pipe', req.body);
  // axios({
  //   method: req.method,
  //   url: 'https://local-alert-network-tracker.herokuapp.com/',
  //   data: req.body,
  //   headers: { 'Content-type': 'application/json' },
  // })
  //   .then((data) => {
  //     res.send(data.data);
  //   })
  //   .catch((err) => {
  //     res.send(err.message);
  //   });
});

app.use('/graphql', bodyparser.json(), graphqlExpress({
  schema,
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`,
}));

// app.post('/api/notifications', (req, res, next) => {
//   console.log('DATA RECIEVED!', req.body);
// });

app.use(cors({
  allowedHeaders: ['Content-Type', 'application/json'],
}));


app.get('*', (req, res) => {
  res.redirect('/');
});

module.exports = app;
