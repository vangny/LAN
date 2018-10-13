const { makeExecutableSchema } = require('graphql-tools');
const { resolvers } = require('./resolvers');


// const {
//   buildSchema,
// } = require('graphql');

// const { GraphQLSchema, GraphQLObjectType } = require
// const { gql } = require('apollo-server-express');

const typeDefs = `
  type Query {
    getAlerts(latitude: Float,
      longitude: Float,
      range: Float): [Alert]
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
      provider_id: String
      picture: String
      token: String
    ): User
    setHome(
      email: String
      latitude: Float
      longitude: Float
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
    url: String
    photoTag: String
    createdAt: Date
  }
  type Coordinates {
    latitude: String
    longitude: String
  }
  type User {
    id: ID
    name: String
    email: String
    provider: String
    provider_id: String
    picture: String
    token: String
    homeLat: Float
    homeLong: Float
  }
  scalar Date
  type MyType {
    created: Date
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
exports.schema = schema;
exports.typeDefs = typeDefs;
