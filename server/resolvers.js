const {
  GraphQLScalarType,
} = require('graphql');
const { PubSub } = require('graphql-subscriptions');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { Kind } = require('graphql/language');

const db = require('../db/index');

const pubsub = new PubSub();

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
      subscribe: () => pubsub.asyncIterator('NEW_ALERT'),
    },
  },
  createAlert: ({
    EventId, category, latitude, longitude, notes, url, photoTag,
  }) => {
    // pubsub.publish(NEW_ALERT, { newAlert: { category } });
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
};

exports.root = root;
