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
  
  type User {
    id: ID
    name: String
    email: String
    provider: String
    provider_id: Int
    picture: String
    token: Int
  }
  
  scalar Date
  
  type MyType {
    created: Date
  }
  
  schema {
    query: Query,
    mutation: Mutation,
    subscription: Subscription
  }
  
  `;

const schema = makeExecutableSchema({ typeDefs, resolvers });
exports.schema = schema;
exports.typeDefs = typeDefs;
