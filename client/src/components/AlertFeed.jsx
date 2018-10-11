import React from 'react';
import axios from 'axios';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
// import GetAlerts from '../getAlerts';

const AlertFeed = ({ latitude, longitude }) => {
  const distance = (lat1, lon1, lat2, lon2) => {
    const radlat1 = Math.PI * lat1 / 180;
    const radlat2 = Math.PI * lat2 / 180;
    const theta = lon1 - lon2;
    const radtheta = Math.PI * theta / 180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2)
              + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    return dist;
  };

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
  //   const NEW_ALERT = gql`
  //     subscription {
  //       newAlert {
  //         id
  //         latitude
  //         longitude
  //         category
  //         url
  //         createdAt
  //       }
  //     }
  //     `;

  const range = 10000000;

  return (
    <div className="feed">
    <span>{`Current search radius: ${range} miles`}</span>
      <Query query={GET_ALERTS} variables={{ latitude, longitude, range }}>
        {({ loading, error, data }) => {
          if (loading) return <p> Loading...</p>;
          if (error) return <p>Error fetching alerts...</p>;

          // if (!unsubscribe) {
          //   unsubscribe = subscribeToMore({
          //     document: NEW_ALERT,
          //     updateQuery: (prev, { subscriptionData }) => {
          //       if (!subscriptionData.data) return prev;
          //       const { newAlert } = subscriptionData.data;
          //       return {
          //         ...prev,
          //         getAlerts: [...prev.getAlerts, newAlert],
          //       };
          //     },
          //   });
          // }

          if (data.getAlerts.length === 0) return <p>{`Currently no alerts within ${range} miles. Consider expanding your search`}</p>;
          console.log('GET ALERTS DATA: ', data);
          return (

            data.getAlerts.map(alert => ( window.innerWidth >= 1200 ? (
              <div className="alert" key="alert.id">
                {`Category: ${alert.category}`}
                <br />
                {moment(alert.createdAt).fromNow()}
                <br />
                {`${Math.max(Math.round(distance(alert.latitude, alert.longitude, latitude, longitude) * 10) / 10).toFixed(2)} miles away`}
              </div>
            ): (alert.url !== null ? (
              <div className="alert" key="alert.id">
                <div className="image-container">
                  <img src={alert.url} width='200' height='145' />
                </div>
                <div className="alert-info-container">
                  {`Category: ${alert.category}`}
                  <br />
                  {moment(alert.createdAt).fromNow()}
                  <br />
                </div>
              </div>
            ) : (
              <div className="alert" key="alert.id">
                <div className="alert-info-container">
                  {`Category: ${alert.category}`}
                  <br />
                  {moment(alert.createdAt).fromNow()}
                  <br />
                </div>
              </div>
            )
            )))
          )

        }}
      </Query>
    </div>
  )
};
  
//   return alerts? (
//     <div className="feed">
//       {alerts.map(alert => ( window.innerWidth >= 1200 ? (
//         <div className="alert" key="alert.id">
//           {`Category: ${alert.category}`}
//           <br />
//           {moment(alert.createdAt).fromNow()}
//         </div>
//       ) : (alert.url !== null ? (
//         <div className="alert" key="alert.id">
//           <div className="image-container">
//             <img src={alert.url} width='200' height='145' />
//           </div>
//           <div className="alert-info-container">
//             {`Category: ${alert.category}`}
//             <br />
//             {moment(alert.createdAt).fromNow()}
//             <br />
//           </div>
//         </div>
//       ) : (
//         <div className="alert" key="alert.id">
//           <div className="alert-info-container">
//             {`Category: ${alert.category}`}
//             <br />
//             {moment(alert.createdAt).fromNow()}
//             <br />
//           </div>
//         </div>
//       )
//       )))}
//     </div>
//   ) : (
//     <div className="feed">
//       <span>No local alerts currently</span>
//   const range = 10000000;
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
//     subscription {
//       newAlert {
//         id
//         latitude
//         longitude
//         category
//         url
//         createdAt
//       }
//     }
//     `;
//   // let unsubscribe = null;
//   return (
//     <div className="feed">
//     <span>{`Current search radius: ${range} miles`}</span>
//       <Query query={GET_ALERTS} variables={{ latitude, longitude, range }}>
//         {({ loading, error, data }) => {
//           if (loading) return <p> Loading...</p>;
//           if (error) return <p>Error fetching alerts...</p>;

//           // if (!unsubscribe) {
//           //   unsubscribe = subscribeToMore({
//           //     document: NEW_ALERT,
//           //     updateQuery: (prev, { subscriptionData }) => {
//           //       if (!subscriptionData.data) return prev;
//           //       const { newAlert } = subscriptionData.data;
//           //       return {
//           //         ...prev,
//           //         getAlerts: [...prev.getAlerts, newAlert],
//           //       };
//           //     },
//           //   });
//           // }

//           if (data.getAlerts.length === 0) return <p>{`Currently no alerts within ${range} miles. Consider expanding your search`}</p>;
//           console.log('GET ALERTS DATA: ', data);
//           return data.getAlerts.map(alert => (
//             <div className="alert" key="alert.id">
//               {`Alert: ${alert.category}`}
//               <br />
//               {moment(alert.createdAt).fromNow()}
//               <br />
//               {`${Math.max(Math.round(distance(alert.latitude, alert.longitude, latitude, longitude) * 10) / 10).toFixed(2)} miles away`}
//             </div>
//           ));
//         }}
//       </Query>
//     </div>
//   );
// };

export default AlertFeed;
