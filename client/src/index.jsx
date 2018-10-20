import React from 'react';
import { gql } from 'graphql-tag';

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
