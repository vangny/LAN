import React from 'react';
import axios from 'axios';
import { Query, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
// import GetAlerts from '../getAlerts';

class AlertFeed extends React.Component {
  constructor({ alerts }) {
    super();
    this.state = {
      alerts
    };
    
    this.componentDidMount = this.componentDidMount.bind(this);
    this.renderAlertData = this.renderAlertData.bind(this);
  }
  
  componentDidMount() {
    const { subscribeToNewAlerts } = this.props;
    // const { alerts } = this.state;
    
    subscribeToNewAlerts();
    const alertCache = this.props.client.cache.data.data;
    console.log('alertCache: ', alertCache);
    const alerts = [];
    for (let i = 0; i < Object.keys(alertCache).length; i += 1) {
      alerts.push(alertCache[Object.keys(alertCache)[i]]);
    }
    // this.setState({
    //   alerts,
    // }, () => { console.log(this.state.alerts)});
    // // console.log('cached alerts: ', this.props.client);
  }

  renderAlertData() {
    const { range, latitude, longitude } = this.props;
    const { alerts } = this.state;
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
    if (alerts.length === 0) return <p>{`Currently no alerts within ${range} miles. Consider expanding your search`}</p>;
    return (

      alerts.map(alert => (window.innerWidth >= 1200 ? (
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
      )))
    );
  }

  render() {
    const { range } = this.props;

    return (
      <div className="AlertFeed">
        <span>{`Current search scope: ${range} miles`}</span>
        {this.renderAlertData()}
      </div>
    );
  }

};

export default AlertFeed;
