const express = require('express');
const bodyparser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const iconv = require('iconv-lite');
const encodings = require('iconv-lite/encodings');

iconv.encodings = encodings;

const { schema } = require('./schema');

const db = require('../db/index');
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

app.post('/api/user', (req, res) => {
  console.log('user data received!', req.body);
  const { 
    name,
    email,
    provider,
    provider_id,
    picture,
    token,
  } = req.body;
  db.doesUserExist(name)
    .then((result) => {
      if (result) {
        console.log('user exists!');
      } else {
        return db.User.create({
          name,
          email,
          provider,
          provider_id,
          picture,
          token,
        })
          .then(() => {
            res.status(200).send(token);
          },
          () => {
            console.log('token sent to client', token);
          });
      }
    });
});

module.exports = app;
