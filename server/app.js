const express = require('express');
const expressStaticGzip = require('express-static-gzip');
const bodyparser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const iconv = require('iconv-lite');
const encodings = require('iconv-lite/encodings');
const axios = require('axios');
const cors = require('cors');
const Geocode = require('react-geocode');
const db = require('../db/index');

iconv.encodings = encodings;

const { schema } = require('./schema');

const PORT = process.env.PORT || 9000;

const app = express();

app.use('/', expressStaticGzip(`${__dirname}/../client/dist`));

app.use(bodyparser.json());
// app.use(express.static(`${__dirname}/../client/dist`));
// app.use(express.static(`${__dirname}, "jsx"`));

// note change back to app.use after tests
app.post('api/tracker', (req, res) => {
});

app.use('/graphql', bodyparser.json(), graphqlExpress({
  schema,
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`,
}));

app.use(cors({
  allowedHeaders: ['Content-Type', 'application/json'],
}));


app.get('*', (req, res) => {
  res.redirect('/');
});

module.exports = app;
