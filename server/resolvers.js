<<<<<<< HEAD

=======
>>>>>>> Begin connecting Apollo Client Side
const { PubSub } = require('graphql-subscriptions');

const { SubscriptionServer } = require('subscriptions-transport-ws');

const { Kind } = require('graphql/language');

const db = require('../db/index');

const pubsub = new PubSub();
<<<<<<< HEAD
const NEW_ALERT = 'NEW_ALERT';

const resolvers = {
  Query: {
    getAlerts: (root, args, context) => (
      db.getAlerts(args.latitude, args.longitude, args.range)
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
<<<<<<< HEAD
  },
  Mutation: {
    findOrCreateEvent: (root, args, context) => {
      console.log('searching for existing event...');
      return db.findOrCreateEvent(args.category, args.latitude, args.longitude, args.timeStamp)
        .then(event => event); // the result will be the event object that was just created
    },
    createAlert: (root, args, context) => {
      return db.createAlert(args.EventId, args.category, args.latitude, args.longitude, args.notes, args.url, args.photoTag)
        .then((alert) => {
          pubsub.publish(NEW_ALERT, { newAlert: alert });
          return alert;
        });
    },
  },
  Subscription: {
    newAlert: {
      subscribe: () => pubsub.asyncIterator(NEW_ALERT),
    },
  },
  Date: {
    __parseValue(value) {
      return new Date(value); // value from the client
    },
    __serialize(value) {
      return value.getTime(); // value sent to the client
    },
    __parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  },
};

exports.resolvers = resolvers;
=======

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
>>>>>>> Separate server into multiple files to separate concerns
=======
  },
  Mutation: {
    findOrCreateEvent: (root, args, context) => {
      console.log('searching for existing event...');
      return db.findOrCreateEvent(args.category, args.latitude, args.longitude, args.timeStamp)
        .then(event => event); // the result will be the event object that was just created
    },
    createAlert: (root, args, context) => {
      return db.createAlert(args.EventId, args.category, args.latitude, args.longitude, args.notes, args.url, args.photoTag)
        .then((alert) => {
          pubsub.publish(NEW_ALERT, { alert });
          return alert;
        });
    },
  },
  Subscription: {
    newAlert: {
      subscribe: () => pubsub.asyncIterator(NEW_ALERT),
    },
  },
  Date: {
    __parseValue(value) {
      return new Date(value); // value from the client
    },
    __serialize(value) {
      return value.getTime(); // value sent to the client
    },
    __parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  },
};

exports.resolvers = resolvers;
>>>>>>> Refactor graphql server
