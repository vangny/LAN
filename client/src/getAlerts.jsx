import React from 'react';
import { Query } from 'react-apollo';
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
    <Query query={GET_ALERTS} variables={{ latitude, longitude, range }}>
      {({ loading, error, data, subscribeToMore, ...result }) => {
        console.log('result: ', result);
        if (loading) return <p> Loading...</p>;
        if (error) return <p>Error fetching alerts...</p>;

        return (
          <AlertFeed
            {...result}
            latitude={latitude}
            longitude={longitude}
            alerts={data.getAlerts}
            subscribeToNewAlerts={
              () => subscribeToMore({
                document: NEW_ALERT,
                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data) return prev;
                  const newAlertItem = subscriptionData.data.newAlert;

                  return Object.assign({}, prev, {
                    entry: {
                      getAlerts: [newAlertItem, ...prev.entry.getAlerts],
                    },
                  });
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

// if (data.getAlerts.length === 0) return <p>{`Currently no alerts within ${range} miles. Consider expanding your search`}</p>;
//             console.log('GET ALERTS DATA: ', data);
//             return (
      
//               data.getAlerts.map(alert => ( window.innerWidth >= 1200 ? (
//                 <div className="alert" key="alert.id">
//                   {`Category: ${alert.category}`}
//                   <br />
//                   {moment(alert.createdAt).fromNow()}
//                   <br />
//                   {`${Math.max(Math.round(distance(alert.latitude, alert.longitude, latitude, longitude) * 10) / 10).toFixed(2)} miles away`}
//                 </div>
//               ): (alert.url !== null ? (
//                 <div className="alert" key="alert.id">
//                   <div className="image-container">
//                     <img src={alert.url} width='200' height='145' />
//                   </div>
//                   <div className="alert-info-container">
//                   {`Category: ${alert.category}`}
//                   <br />
//                   {moment(alert.createdAt).fromNow()}
//                   <br />
//                   {`${Math.max(Math.round(distance(alert.latitude, alert.longitude, latitude, longitude) * 10) / 10).toFixed(2)} miles away`}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="alert" key="alert.id">
//                   <div className="alert-info-container">
//                   {`Category: ${alert.category}`}
//                   <br />
//                   {moment(alert.createdAt).fromNow()}
//                   <br />
//                   {`${Math.max(Math.round(distance(alert.latitude, alert.longitude, latitude, longitude) * 10) / 10).toFixed(2)} miles away`}
//                   </div>
//                 </div>
//               )
//               )))
//             )




