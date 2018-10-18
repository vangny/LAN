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

// app.get('/cityData', (req, res) => {
//   console.log('*********PINGING cityData request********')
//   console.log('*********request body from resolver: ', req.body);
//   res.send(axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
//     params: {
//       latlng: `${req.body.latitude} ${req.body.longitude}`,
//       key: 'AIzaSyBw40_vEv6NHYs-KuIa0vIdBskirlviY-Q',
//     },
//   }).then((response) => {
//     const address = response.data.results[4].formatted_address;
//     // const addressOutput = `
//     // <span className="city-state">${address}</span>
//     // `;
//     console.log(address);
//     return address;
//   })
//     .catch(error => console.log(error)))
// });

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
