import React from 'react';
import { gql } from 'graphql-tag';
// import ReactDOM from 'react-dom';
// import { ApolloProvider } from 'react-apollo';
// import { ApolloClient } from 'apollo-client';
// import { HttpLink } from 'apollo-link-http';
// import { InMemoryCache } from 'apollo-cache-inmemory';
// import App from './App';

// const client = new ApolloClient({
//   link: new HttpLink({ uri: 'http://localhost:9000/graphql' }),
//   cache: new InMemoryCache(),
// });

// console.log('INDEX IS RUNNING!')

// ReactDOM.render(
//   <ApolloProvider client={client}>
//     <App />
//   </ApolloProvider>, document.getElementById('app'),
// );

const ALERT_SUBSCRIPTION = gql`
  subscription onNewAlert {
    newAlert {
      id
      category
    }
  }
`
export default () => {
  <Subscription
  subscription={ALERT_SUBSCRIPTION}
  >
  {({ data: { newAlert }, loading })=> (
    <h4>New alert: {!loading && newAlert.category}</h4>
  )}
  </Subscription>
};
