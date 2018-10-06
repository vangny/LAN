const express = require('express');
const bodyparser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const {
  buildSchema,
  GraphQLScalarType,
} = require('graphql');
const { PubSub } = require('graphql-subscriptions');
const { Kind } = require('graphql/language');

const iconv = require('iconv-lite');
const encodings = require('iconv-lite/encodings');

iconv.encodings = encodings;

const db = require('../db/index');

// const pubsub = new PubSub();

const schema = buildSchema(`
  type Query {
<<<<<<< HEAD
    alerts: [Alert]
    getAlerts(latitude: Float,
      longitude: Float,
      range: Float): [Alert]
=======
    getAlerts(latitude: Float,
      longitude: Float,
      range: Float): [Alert]
    getMedia: [Media]
    getCoords: [Coordinates]
>>>>>>> Refactor /media and /coordinates endpoints for graphQL
  }

  type Mutation {
    createAlert(
      EventId: Int
      category: String
      latitude: Float
      longitude: Float
      notes: String
      url: String
      photoTag: String
    ): Alert
  }

  type Subscription {
    newAlert: Alert
  }

  type Event {
    id: ID
    latitude: Int
    longitude: Int
    alerts: [Alert]
  }

  type Alert {
    id: ID
    category: String
    latitude: Float
    longitude: Float
    EventId: Int
    media: [Media]
    createdAt: Date
  }

  type Media {
    id: ID
    url: String
    photoTag: String
    AlertId: Alert
  }

  type Coordinates {
    latitude: String
    longitude: String
  }

  scalar Date

  type MyType {
    created: Date
  }

`);

const NEW_ALERT = 'NEW_ALERT';

const root = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      value.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value);
      }
      return null;
    },
  }),
  Subscription: {
    newAlert: {
      subscribe: () => pubsub.asyncIterator(NEW_ALERT),
    },
  },
  createAlert: (alertData) => {
    // pubsub.publish(NEW_ALERT, { newAlert: alertData });
    const {
      EventId, category, latitude, longitude, notes, photo, photoTag,
    } = alertData;

    return db.createAlert(EventId, category, latitude, longitude, notes, photo, photoTag)
      .then((alert) => {
        return alert;
      });
    // .then(db.getAlerts)
    // .then((alerts) => {
    //   res.status(201).send(alerts.map(alert => alert.dataValues));
    // });
  },
  getAlerts: ({ latitude, longitude, range }) => (
    db.getAlerts(latitude, longitude, range)
      .then(alerts => (
        alerts.map(alert => alert.dataValues)
      ))
  ),
  getCoords: () => {
    console.log('grabbing coordinates...');
    return db.getCoordinates()
      .then(data => data.map(coordinate => coordinate.dataValues));
  },
  getMedia: () => {
    console.log('grabbing media files...');
    return db.getMedia()
      .then(data => data.map(file => file.dataValues));
  },
};

const app = express();

app.use(bodyparser.json());
app.use(express.static(`${__dirname}/../client/dist`));
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

// app.get('/api/feed/', (req, res) => {
//   console.log(Number(req.query.latitude));
//   console.log(Number(req.query.longitude));
//   db.getAlerts(Number(req.query.latitude), Number(req.query.longitude), Number(req.query.range)).then((alerts) => {
//     console.log(alerts);
//     res.status(200).send(alerts.map(alert => alert.dataValues));
//   });
// });

<<<<<<< HEAD

app.get('/api/coordinates', (req, res) => {
  console.log('grabbing coordinates...');
  db.getCoordinates().then((coordinates) => {
    res.status(201).send(coordinates.map(data => data.dataValues));
  });
});
=======
// app.get('/api/coordinates', (req, res) => {
//   console.log('grabbing coordinates...');
//   db.getCoordinates().then((coordinates) => {
//     res.status(201).send(coordinates.map(data => data.dataValues));
//   });
// });
>>>>>>> Refactor /media and /coordinates endpoints for graphQL

// app.get('/api/media', (req, res) => {
//   console.log('grabbing media files...');
//   db.getMedia().then((files) => {
//     res.status(201).send(files.map(data => data.dataValues));
//   });
// });

app.post('/api/events', (req, res) => {
  const {
    latitude, longitude, category, timeStamp,
  } = req.body;
  // console.log(latitude, longitude, category, timeStamp);
  db.findOrCreateEvent(category, latitude, longitude, timeStamp)
    .then((event) => { // the result will be the event object that was just created
      console.log('server returns: ', event);
      res.send(event);
    });
});

module.exports = app;
