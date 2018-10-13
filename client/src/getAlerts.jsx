import React from 'react';
import { Query, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import AlertFeed from './components/AlertFeed';

// const GetAlerts = ({ latitude, longitude }) => {
//   const range = 10;
//   const GET_ALERTS = gql`
//     query GetAlerts($latitude: Float, $longitude: Float, $range: Float) {
//       getAlerts(latitude: $latitude, longitude: $longitude, range: $range){
//         id
//         latitude
//         longitude
//         category
//         url
//         createdAt
  
//       }
//     }
//     `;
//   const NEW_ALERT = gql`
//   subscription {
//     newAlert {
//       id
//       latitude
//       longitude
//       category
//       url
//       createdAt
//     }
//   }
//   `;

//   return (
//     <Query query={GET_ALERTS} variables={{ latitude, longitude, range }} pollInterval={5000}>
//       {({ loading, error, data, subscribeToMore, ...result }) => {
//         if (loading) return <p> Loading...</p>;
//         if (error) return <p>Error fetching alerts...</p>;
//         console.log('data.getAlerts: ', data.getAlerts);
//         return (
//           <AlertFeed
//             {...result}
//             range={range}
//             latitude={latitude}
//             longitude={longitude}
//             alerts={data.getAlerts}
//             subscribeToNewAlerts={
//               () => subscribeToMore({
//                 document: NEW_ALERT,
//                 updateQuery: (prev, { subscriptionData }) => {
//                   if (!subscriptionData.data) return prev;
//                   const { newAlert } = subscriptionData.data;
//                   console.log('updateQuery returns', { ...prev, getAlerts: [newAlert, ...prev.getAlerts] });
//                   return {
//                     ...prev,
//                     getAlerts: [newAlert, ...prev.getAlerts],
//                   };
//                 },
//               })
//             }
//           />
//         );
//       }}
//     </Query>
//   );
// };
// export default GetAlerts;
const latitude = 37.7223677;
const longitude = -122.1584149;
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

let unsubscribe = null;

export default () => (

  <Query query={GET_ALERTS} variables={{ latitude, longitude, range }} >
    {({ loading, error, data, subscribeToMore, ...result }) => {
      if (loading) return <p> Loading...</p>;
      if (error) return <p>Error fetching alerts...</p>;
      if (!unsubscribe) {
        unsubscribe = subscribeToMore({
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
      return (
        <div>
          {data.getAlerts.map(alert => (window.innerWidth >= 1200 ? (
            <div className="alert" key={Number(alert.id)}>
              {`Category: ${alert.category}`}
              <br />
              {moment(alert.createdAt).fromNow()}
              <br />
              {`${Math.max(Math.round(distance(alert.latitude, alert.longitude, latitude, longitude) * 10) / 10).toFixed(2)} miles away`}
            </div>
            ): (alert.url !== null ? (
            <div className="alert" key={Number(alert.id)}>
              <div className="image-container">
                <img src={alert.url} width='200' height='145' />
              </div>
              <div className="alert-info-container">
                {`Category: ${alert.category}`}
                <br />
                {moment(alert.createdAt).fromNow()}
                <br />
                {`${Math.max(Math.round(distance(alert.latitude, alert.longitude, latitude, longitude) * 10) / 10).toFixed(2)} miles away`}
              </div>
            </div>
            ) : (
            <div className="alert" key={Number(alert.id)}>
              <div className="alert-info-container">
                {`Category: ${alert.category}`}
                <br />
                {moment(alert.createdAt).fromNow()}
                <br />
                {`${Math.max(Math.round(distance(alert.latitude, alert.longitude, latitude, longitude) * 10) / 10).toFixed(2)} miles away`}
              </div>
            </div>
            )
          )))}
        </div>
      )  
    }}
  </Query>
)




// {data.getAlerts.map((alert) => {
//   return (
//     <div key={alert.id}>
//     {`Alert: ${alert.category}`}
//     <br />
//     </div>
//   )
//   // <h3 key={alert.id}>{alert.category}</h3>
// })}