
const { PubSub } = require('graphql-subscriptions');

const { SubscriptionServer } = require('subscriptions-transport-ws');

const { Kind } = require('graphql/language');

const db = require('../db/index');

const pubsub = new PubSub();

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
    // getMedia: () => {
    //   console.log('grabbing media files...');
    //   return db.getMedia()
    //     .then(data => data.map(file => file.dataValues));
    // },
    
    // Revise
    // getUser: () => {
    //   console.log('Searching for user...');
    // },
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
    findOrCreateUser: (root, args, context) => {
      console.log('searching for existing user...');
      return db.doesUserExist(args.email)
        .then((result) => {
          if (result) {
            console.log('user already exists!');
            return args;
          }
          if (!result) {
            console.log('New user created!')
            return db.User.create({
              name: args.name,
              email: args.email,
              provider: args.provider,
              provider_id: args.provider_id,
              picture: args.picture,
              token: args.token,
            });
          }
          return args;
        });
    },
    setHome: (root, args, context) => {
      console.log('User requests new home location to be set...');
      const values = ({ homeLat: args.latitude }, { homeLong: args.longitude });
      const selector = {
        where: { email: args.email },
      };
      return db.User.update(values, selector)
        .then(result => console.log('User location updated, Success!', result))
        .catch(err => console.log(err));
    },
    // addFriend: (root, args, context) => {
    //   console.log('User requests to add a new friend...');
     
    //   return db.User.newFriends(args.userEmail, args.friendEmail)
    //     .then(result => console.log('New friend added... Success!', result))
    //     .catch(err => console.log(err));
    // },
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
