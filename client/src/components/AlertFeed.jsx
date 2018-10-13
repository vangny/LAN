import React from 'react';
import axios from 'axios';
import { Query, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import queryComponent from '../getAlerts';

class AlertFeed extends React.Component {
  constructor() {
    super();
    // this.state = {
    //   alerts
    // };
    
    // this.componentDidMount = this.componentDidMount.bind(this);
    // this.renderAlertData = this.renderAlertData.bind(this);
  }
  
  componentDidMount() {
    // console.log('mounting AlertFeed');
    // const { subscribeToNewAlerts } = this.props;
    // const { alerts } = this.state;
    // const alertCache = this.props.client.cache.data.data;
    
    // subscribeToNewAlerts();
    // console.log('1. alertCache: ', alertCache);
    // console.log('2. Object.keys(alertCache): ', Object.keys(alertCache));
    // const alerts = [];
    // for (let i = 0; i < Object.keys(alertCache).length; i += 1) {
    //   alerts.push(alertCache[Object.keys(alertCache)[i]]);
    // }

    
  
  // console.log('3. Alerts before setState: ', alerts);
  // this.setState({
    //   alerts,
    // }, () => { console.log('4. Alerts after setState: ', this.state.alerts)});
    // console.log('cached alerts: ', this.props.client);
  }

  render() {
    const { latitude, longitude } = this.props;
    const range = 10;
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
    return (
      <div className="AlertFeed">
        <Query query={GET_ALERTS} variables={{ latitude, longitude, range }}>
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
            ) ; 
          }}
        </Query>
      </div>
    );
  }

};

export default AlertFeed;
