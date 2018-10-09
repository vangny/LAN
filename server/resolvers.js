const {
  GraphQLScalarType,
} = require('graphql');
const { PubSub } = require('graphql-subscriptions');
// const { SubscriptionServer } = require('subscriptions-transport-ws');
const { Kind } = require('graphql/language');

const db = require('../db/index');

const pubsub = new PubSub();
const NEW_ALERT = 'NEW_ALERT';

const root = {
  // Query: {
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
  // },
  // Mutation: {
  findOrCreateEvent: ({
    category, latitude, longitude, timeStamp,
  }) => {
    console.log('searching for existing event...');
    return db.findOrCreateEvent(category, latitude, longitude, timeStamp)
      .then(event => event); // the result will be the event object that was just created
  },
  createAlert: async ({
    EventId, category, latitude, longitude, notes, url, photoTag,
  }) => {
    return db.createAlert(EventId, category, latitude, longitude, notes, url, photoTag)
      .then((alert) => {
        pubsub.publish(NEW_ALERT, { newAlert: alert });
        return alert;
      });   
    // const alert = await db.createAlert(EventId, category, latitude, longitude, notes, url, photoTag);
    // pubsub.publish(NEW_ALERT, { alert });
    // return alert;
  },
// },
  
  newAlert: {
    subscribe: () => pubsub.asyncIterator(NEW_ALERT),
  },
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
};

exports.root = root;
