// const app = require('./app');
<<<<<<< HEAD
=======
const port = process.env.PORT || 9000;
const express = require('express');
const bodyparser = require('body-parser');
const graphqlHTTP = require('express-graphql');

const iconv = require('iconv-lite');
const encodings = require('iconv-lite/encodings');

const { schema } = require('./graphqlSchema');
const { root } = require('./resolvers');

iconv.encodings = encodings;

const app = express();

app.use(bodyparser.json());
app.use(express.static(`${__dirname}/../client/dist`));
// app.use('*', cors({ origin: }))


app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

>>>>>>> Separate server into multiple files to separate concerns

const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
// const graphqlHTTP = require('express-graphql');
const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
// const {
//   ApolloServer,
// } = require('apollo-server-express');
const { SubscriptionServer } = require('subscriptions-transport-ws');

const cors = require('cors');

const iconv = require('iconv-lite');
const encodings = require('iconv-lite/encodings');


// const { resolvers } = require('./resolvers');
const { schema } = require('./schema');

// console.log('this is schema!', schema);

iconv.encodings = encodings;

const PORT = process.env.PORT || 9000;
const app = express();

// app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../client/dist`));
app.use('*', cors({ origin: `http://localhost:3000` }));


app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema,
  // rootValue: root,
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`,
}));

// const apolloServer = new ApolloServer({ typeDefs, resolvers });
// apolloServer.applyMiddleware({ app });

// app.listen({ port: PORT }, () => {
//   console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
// });


const server = createServer(app);
server.listen(PORT, (err) => {
  // console.log(`Apollo Server is now running on http://localhost:${PORT}`);
  if (err) throw err;

  SubscriptionServer.create({
    schema,
    execute,
    subscribe,
    onConnect: () => console.log('Client connected~~~~~~'),
  },
  {
    server,
    path: '/subscriptions',
  });
});
