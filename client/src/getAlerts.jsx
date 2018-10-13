import React from 'react';
import { Query, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import AlertFeed from './components/AlertFeed';

const GetAlerts = ({ latitude, longitude }) => {
  const range = 10;
  const GET_ALERTS = gql`
    query GetAlerts($latitude: Float, $longitude: Float, $range: Float) {
      getAlerts(latitude: $latitude, longitude: $longitude, range: $range){
        id
        latitude
        longitude
        category
        url
        createdAt
  
      }
    }
    `;
  const NEW_ALERT = gql`
  subscription {
    newAlert {
      id
      latitude
      longitude
      category
      url
      createdAt
    }
  }
  `;

  return (
    <Query query={GET_ALERTS} variables={{ latitude, longitude, range }} pollInterval={5000}>
      {({ loading, error, data, subscribeToMore, ...result }) => {
        if (loading) return <p> Loading...</p>;
        if (error) return <p>Error fetching alerts...</p>;
        console.log('rendering feed');
        return (
          <AlertFeed
            {...result}
            range={range}
            latitude={latitude}
            longitude={longitude}
            alerts={data.getAlerts}
            subscribeToNewAlerts={
              () => subscribeToMore({
                document: NEW_ALERT,
                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data) return prev;
                  const { newAlert } = subscriptionData.data;
                  console.log('updateQuery returns', { ...prev, getAlerts: [newAlert, ...prev.getAlerts] });
                  return {
                    ...prev,
                    getAlerts: [newAlert, ...prev.getAlerts],
                  };
                },
              })
            }
          />
        );
      }}
    </Query>
  );
};
export default GetAlerts;
