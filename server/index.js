// const app = require('./app');
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


if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Listening on ${port}`, `Running a GraphQL API server at localhost:${port}/graphql`);
  });
  // app.start(() => console.log(`Server running on localhost:4000`))
}
