const { makeExecutableSchema } = require('graphql-tools');
const { resolvers } = require('./resolvers');

const typeDefs = `
  type Query {
    getAlerts(latitude: Float,
      longitude: Float,
      range: Int,
      filter: String): [Alert]
    getCoords: [Coordinates]
    friends(userId: Int): [User]
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
      userId: Int
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

    findOrCreateFriendship(
      userId: Int
      userEmail: String
      friendEmail: String
    ): Friendship

    setHome(
      email: String
      latitude: Float
      longitude: Float
    ): User
  }

  type Subscription {
    newAlert: Alert
  }

  type Friendship {
    user1: String
    user2: String
    new: Boolean
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
    userId: Int
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
