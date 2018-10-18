import React from 'react';
import axios from 'axios';
import { Query, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';

const AlertFeed = ({ latitude, longitude , filter, range, client, selectAlert }) => {
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
        notes
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
  
  const insertIcon = (category) => {
    // return null;
    // console.log('inserting icon!');
    if (!category) {
      return null;
    }
    if (category.toUpperCase() === 'HURRICANE') {
      return <img className="alert-icon" src={require('../../../icons/button-icons/013-hurricane.png')} alt="hurricane" />;
    }
    if (category.toUpperCase() === 'FLOOD') {
      return <img className="alert-icon" src={require('../../../icons/button-icons/016-flood.png')} alt="flood" />;
    }
    if (category.toUpperCase() === 'FOREST FIRE') {
      return <img className="alert-icon" src={require('../../../icons/button-icons/015-fire.png')} alt="forest fire" />;
    }
    if (category.toUpperCase() === 'HOUSE FIRE') {
      return <img className="alert-icon" src={require('../../../icons/button-icons/014-house.png')} alt="house fire" />;
    }
    if (category.toUpperCase() === 'EARTHQUAKE') {
      return <img className="alert-icon" src={require('../../../icons/button-icons/018-earthquake.png')} alt="earthquake" />;
    }
    if (category.toUpperCase() === 'LANDSLIDE') {
      return <img className="alert-icon" src={require('../../../icons/button-icons/006-landslide-2.png')} alt="landslide" />;
    }
    if (category.toUpperCase() === 'TRAFFIC ACCIDENT') {
      return <img className="alert-icon" src={require('../../../icons/button-icons/car-collision (1).png')} alt="traffic accident" />;
    }
    if (category.toUpperCase() === 'VOLCANO ERUPTION') {
      return <img className="alert-icon" src={require('../../../icons/button-icons/001-volcano-1.png')} alt="volcano eruption" />;
    }
    if (category.toUpperCase() === 'TSUNAMI') {
      return <img className="alert-icon" src={require('../../../icons/button-icons/003-tsunami.png')} alt="tsunami" />;
    }
    if (category.toUpperCase() === 'CRIMINAL ACTIVITY') {
      return <img className="alert-icon" src={require('../../../icons/button-icons/thief.png')} alt="criminal activity" />;
    }
    if (category.toUpperCase() === 'TOXIC WASTE') {
      return <img className="alert-icon" src={require('../../../icons/button-icons/004-waste.png')} alt="toxic waste" />;
    }
    if (category.toUpperCase() === 'BLIZZARD') {
      return <img className="alert-icon" src={require('../../../icons/button-icons/blizzard.png')} alt="blizzard" />;
    }
  };

  const convertDistance = (num) => {
    return num < 1
      ? 'Less than a mile away'
      : `${Math.ceil(num)} miles away`;
  }

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
                <div className="alert" key={Number(alert.id)} onClick={() => selectAlert(alert)} >
                   <div className="alert-icon-container">
                    {insertIcon(alert.category)}
                   </div>
                   <div className="image-info-container">
                      {`Alert: ${alert.category}`}
                      <br />
                      {moment(alert.createdAt).fromNow()}
                      <br />
                      {convertDistance(distance(alert.latitude, alert.longitude, latitude, longitude))}
                   </div>
                </div>
                ): (alert.url !== null ? (
                <div className="alert" key={Number(alert.id)} onClick={() => selectAlert(alert)} >
                  <div className="alert-icon-container">
                    {insertIcon(alert.category)}
                  </div>
                  <div className="image-info-container">
                    <div className="image-container">
                      <img src={alert.url} width='200' height='145' />
                    </div>
                    <div className="alert-info">
                      {`Alert: ${alert.category}`}
                      <br />
                      {moment(alert.createdAt).fromNow()}
                      <br />
                      {convertDistance(distance(alert.latitude, alert.longitude, latitude, longitude))}
                    </div>
                  </div>
                </div>
                ) : (
                  <div className="alert" key={Number(alert.id)} onClick={() => selectAlert(alert)}>
                    <div className="alert-icon-container">
                    {insertIcon(alert.category)}
                    </div>
                    <div className="image-info-container">
                      {`Alert: ${alert.category}`}
                      <br />
                      {moment(alert.createdAt).fromNow()}
                      <br />
                      {convertDistance(distance(alert.latitude, alert.longitude, latitude, longitude))}
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
