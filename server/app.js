const express = require('express');
const bodyparser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const {
  buildSchema,
  GraphQLScalarType,
} = require('graphql');
const { PubSub } = require('graphql-subscriptions');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { Kind } = require('graphql/language');

const iconv = require('iconv-lite');
const encodings = require('iconv-lite/encodings');

iconv.encodings = encodings;

const db = require('../db/index');

const pubsub = new PubSub();
const app = express();

app.use(bodyparser.json());
app.use(express.static(`${__dirname}/../client/dist`));

const schema = buildSchema(`
  type Query {
    getAlerts(latitude: Float,
      longitude: Float,
      range: Float): [Alert]
    getMedia: [Media]
    getCoords: [Coordinates]
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

    findOrCreateEvent(
      latitude: Float
      longitude: Float
      timeStamp: Date
      category: String
    ): Event

    findOrCreateUser(
      name: String
      email: String
      provider: String
      provider_id: Int
      picture: String
      token: Int
    ): User
  }
  
  type Subscription {
    newAlert: Alert
  }
  
  type Event {
    id: ID
    latitude: Float
    longitude: Float
    alerts: [Alert]
    timeStamp: Date
    category: String
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
<<<<<<< HEAD

  type User {
    id: ID
    name: String
    email: String
    provider: String
    provider_id: Int
    picture: String
    token: Int
  }

=======
  
>>>>>>> Clean up commented out code
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
  createAlert: ({
    EventId, category, latitude, longitude, notes, url, photoTag,
  }) => {
    pubsub.publish(NEW_ALERT, { newAlert: { category } });
    return db.createAlert(EventId, category, latitude, longitude, notes, url, photoTag)
      .then(alert => alert);
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
  findOrCreateEvent: ({
    category, latitude, longitude, timeStamp,
  }) => {
    console.log('searching for existing event...');
    return db.findOrCreateEvent(category, latitude, longitude, timeStamp)
      .then(event => event); // the result will be the event object that was just created
  },
  findOrCreateUser: ({
    name, email, provider, provider_id, picture, token,
  }) => {
    console.log('searching for existing user...');
    // return db.findOrCreateUser(name, email, provider,
    //   provider_id, picture, token)
    //   .then(User => User);
    return 'testing 123';
  },
};

<<<<<<< HEAD
const app = express();

app.use(bodyparser.json());
app.use(express.static(`${__dirname}/../client/dist`));
// app.use(express.static(`${__dirname}, "jsx"`));
=======
>>>>>>> Clean up commented out code
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
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
  res.send(name, picture, token);
});

// app.post('/api/user', (req, res) => {
//   console.log('user data received!', req.body);
//   const { 
//     name,
//     email,
//     provider,
//     provider_id,
//     picture,
//     token,
//   } = req.body;
//   db.doesUserExist(name)
//     .then((result) => {
//       if (result) {
//         console.log('user exists!');
//       } else {
//         return db.User.create({
//           name,
//           email,
//           provider,
//           provider_id,
//           picture,
//           token,
//         })
//           .then(() => {
//             res.status(200).send(token);
//           },
//           () => {
//             console.log('token sent to client', token);
//           });
//       }
//     });
// });

module.exports = app;
