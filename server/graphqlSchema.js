const {
  buildSchema,
} = require('graphql');

// const { GraphQLSchema, GraphQLObjectType } = require
// const { gql } = require('apollo-server-express');

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
  
  scalar Date
  
  type MyType {
    created: Date
  }
  
  schema {
    query: Query,
    mutation: Mutation,
    subscription: Subscription
  }
  
  `);

exports.schema = schema;
