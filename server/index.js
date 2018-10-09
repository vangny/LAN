// const app = require('./app');

const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const graphqlHTTP = require('express-graphql');
const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const {
  ApolloServer, gql,
} = require('apollo-server-express');
const { SubscriptionServer } = require('subscriptions-transport-ws');

const cors = require('cors');

const iconv = require('iconv-lite');
const encodings = require('iconv-lite/encodings');

const { schema } = require('./graphqlSchema');
const { root } = require('./resolvers');

iconv.encodings = encodings;

const PORT = process.env.PORT || 9000;
const app = express();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../client/dist`));
app.use('*', cors({ origin: `http://localhost:${PORT}` }));


app.use('/graphql', graphqlExpress({
  schema,
  rootValue: root,
  graphiql: true,
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`,
}));

// const server = new ApolloServer({ schema, root });
// server.applyMiddleware({ app });

// app.listen({ port: PORT }, () => {
//   console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
// });


const server = createServer(app);
server.listen(PORT, () => {
  console.log(`Apollo Server is now running on http://localhost:${PORT}`);
  new SubscriptionServer({
    schema,
    execute,
    subscribe,
    onConnect: () => console.log('Client connected~~~~~~')
  }, 
  {
    server,
    path: '/subscriptions',
  });
});



// if (process.env.NODE_ENV !== 'test') {
//   app.listen(PORT, () => {
//     console.log(`Listening on ${PORT}`, `Running a GraphQL API server at localhost:${PORT}`);
//   });
// //   // app.start(() => console.log(`Server running on localhost:4000`))
// }

