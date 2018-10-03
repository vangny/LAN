const app = require('./app');
const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log(`Listening on ${port}`, 'Running a GraphQL API server at localhost:9000/graphql');
});
