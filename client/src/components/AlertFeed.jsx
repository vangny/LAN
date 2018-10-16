import React from 'react';
import axios from 'axios';
import { Query, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';

const AlertFeed = ({ latitude, longitude , filter, range, client }) => {
  // const range = 10;
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
    query GetAlerts($latitude: Float, $longitude: Float, $range: Int, $filter: String) {
      getAlerts(latitude: $latitude, longitude: $longitude, range: $range, filter: $filter){
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
  
  // const insertIcon = (category) => {
  //   if (category === 'hurricane') {
  //     return <img 
  //   }
  //   if (category === 'flood') {
      
  //   }
  //   if (category === 'forest fire') {
      
  //   }
  //   if (category === 'house fire') {
      
  //   }
  //   if (category === 'earthquake') {
      
  //   }
  //   if (category === 'landslide') {
      
  //   }
  //   if (category === 'traffic accident') {
      
  //   }
  //   if (category === 'volcano eruption') {

  //   }
  //   if (category === 'tsunami') {

  //   }
  //   if (category === 'criminal activity') {

  //   }
  //   if (category === 'toxic waste') {

  //   }
  //   if (category === 'blizzard') {

  //   }
  // }

  let unsubscribe = null;
  return (
    <div className="feed">
      <Query query={GET_ALERTS} variables={{ latitude, longitude, range: Number(range), filter }} pollInterval={45000}>
        {({ loading, error, data, subscribeToMore }) => {
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
            });
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
          ); 
        }}
      </Query>
    </div>
  );
};

export default AlertFeed;
