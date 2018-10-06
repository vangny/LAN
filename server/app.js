const express = require('express');
const bodyparser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const {
  buildSchema,
  GraphQLSchema,
  GraphQLObjectType,
} = require('graphql');

const { GraphQLServer } = require('graphql-yoga');
const fetch = require('node-fetch');

// const {
//   GraphQLObjectType,
//   GraphQLSchema,
//   GraphQLInt,
//   GraphQLString,
// } = require('graphql/type');

const iconv = require('iconv-lite');
const encodings = require('iconv-lite/encodings');

iconv.encodings = encodings;


const db = require('../db/index');

const schema = buildSchema(`
  type Query {
    alerts: [Alert]
    getAlerts: [Alert]
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
  }

  type Media {
    id: ID
    url: String
    photoTag: String
    AlertId: Alert
  }
`);

const root = {
  createAlert: (alertData) => {
    const {
      EventId, category, latitude, longitude, notes, photo, photoTag,
    } = alertData;

    db.createAlert(EventId, category, latitude, longitude, notes, photo, photoTag);
    // .then(db.getAlerts)
    // .then((alerts) => {
    //   res.status(201).send(alerts.map(alert => alert.dataValues));
    // });
    return alertData;
  },
  getAlerts: () => {
    return db.getAlerts().then((alerts) => {
      return (alerts.map(alert => alert.dataValues));
    });
  },
};


// const resolvers = {
//   Query: {
//     alerts: () => {
//       return fetch(`${baseURL}/api/feed`)
//       .then(res => res.json());
//     },
//   },
// }

// const app = new GraphQLServer({
//   typeDefs: `${__dirname}/schema.graphql`,
//   resolvers,
// })


const app = express();

app.use(bodyparser.json());
app.use(express.static(`${__dirname}/../client/dist`));
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));



// app.use('/api/graphql', graphqlHTTP({
//   query: new GraphQLSchema({
//     mutations: new GraphQLObjectType({
//       createAlert,
//     }),
//   }),
// }));



// app.get('/api/feed', (req, res) => {
//   db.getAlerts().then((alerts) => {
//     res.status(200).send(alerts.map(alert => alert.dataValues));
//   });
// });

app.get('/api/coordinates', (req, res) => {
  console.log('grabbing coordinates...');
  db.getCoordinates().then((coordinates) => {
    res.status(201).send(coordinates.map(data => data.dataValues));
  });
});

app.get('/api/media', (req, res) => {
  console.log('grabbing media files...');
  db.getMedia().then((files) => {
    res.status(201).send(files.map(data => data.dataValues));
  });
});

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

app.post('/api/alerts', (req, res) => {
//   console.log(req.body);
  const {
    EventId, category, latitude, longitude, notes, photo, photoTag,
  } = req.body;

  db.createAlert(EventId, category, latitude, longitude, notes, photo, photoTag)
    .then(db.getAlerts)
    .then((alerts) => {
      res.status(201).send(alerts.map(alert => alert.dataValues));
    });
});

module.exports = app;
