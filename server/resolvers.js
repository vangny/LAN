
const { PubSub } = require('graphql-subscriptions');

const { SubscriptionServer } = require('subscriptions-transport-ws');

const { Kind } = require('graphql/language');

const axios = require('axios');

const db = require('../db/index');

const pubsub = new PubSub();

const NEW_ALERT = 'NEW_ALERT';

const resolvers = {
  Query: {
    getAlerts: (root, args, context) => (
      db.getAlerts(args.latitude, args.longitude, args.range, args.filter)
        .then(alerts => (
          alerts.map(alert => alert.dataValues)
        ))
    ),
    getCoords: () => {
      console.log('grabbing coordinates...');
      return db.getCoordinates()
        .then(data => data.map(coordinate => coordinate.dataValues));
    },
    getMapBox: () => {
      console.log('grabbing mapbox api key...');
      return { key: process.env.MAPBOX_API_KEY };
    },
    getGoogle: () => {
      console.log('grabbing google api key...');
      return { key: process.env.GOOGLE_API_KEY };
    },
    friends: (root, args) => (
      db.getFriends(args.userId)
        .then(friends => friends.map(friend => friend.dataValues))
    ),
  },
  Mutation: {
    findOrCreateEvent: (root, args, context) => {
      console.log('searching for existing event...');
      return db.findOrCreateEvent(args.category, args.latitude, args.longitude, args.timeStamp)
        .then(event => event); // the result will be the event object that was just created
    },
    createAlert: (root, args, context) => {
      const userId = args.userId;
      return db.createAlert(args.EventId, args.category, args.latitude, args.longitude, args.notes, args.url, args.photoTag)
        .then((alert) => {
          pubsub.publish(NEW_ALERT, { newAlert: alert });
          return alert;
        })
        .then((data) => {
          return db.sendToNotofications(userId);
        })
        .then((userTables) => {
          console.log('Data packaged for server', userTables);
          axios.post('https://local-alert-network-tracker.herokuapp.com/', userTables)
          // axios.post('http://ec2-54-149-141-115.us-west-2.compute.amazonaws.com/', userTables)
            .then((res => console.log('Data sent to microservice', res)))
            .catch((err => console.log(err)));
        });
    },
    findOrCreateUser: (root, args, context) => {
      console.log('searching for existing user...');
      return db.doesUserExist(args.email)
        .then((result) => {
          if (result) {
            console.log('user already exists!');
            return result;
          }
          console.log('New user created!');
          return db.User.create({
            name: args.name,
            email: args.email,
            provider: args.provider,
            provider_id: args.provider_id,
            picture: args.picture,
            token: args.token,
          }).then(newUser => newUser.dataValues);
        });
    },
    setHome: (root, args, context) => {
      console.log('User requests new home location to be set...');
      const values = ({ homeLat: args.latitude, homeLong: args.longitude });
      const selector = {
        where: { email: args.email },
      };
     
      return db.User.update(values, selector)
        .then(result => console.log('User location updated, Success!', result))
        .catch(err => console.log(err));
    },

    findOrCreateFriendship: (root, args, context) => {
      return db.findOrCreateFriendship(args.userId, args.userEmail, args.friendEmail)
        .then(friendships => ({
          user1: friendships[0].dataValues.user1,
          user2: friendships[0].dataValues.user2,
          new: friendships[1],
        }))
        .catch((err) => {
          console.log('Cannot find email address: ', err);
          return err;
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
