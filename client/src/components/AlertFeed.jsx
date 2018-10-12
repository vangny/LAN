import React from 'react';
import axios from 'axios';
import { Query, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
// import GetAlerts from '../getAlerts';

class AlertFeed extends React.Component {
  constructor({ subscribeToNewAlerts, alerts, range }) {
    super();
    this.componentDidMount = this.componentDidMount.bind(this);
    this.renderAlertData = this.renderAlertData.bind(this);
  }

  componentDidMount() {
    const { subscribeToNewAlerts } = this.props;
    subscribeToNewAlerts();
  }

  renderAlertData() {
    const { alerts, range, latitude, longitude } = this.props;
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
    console.log('GET ALERTS DATA: ', alerts);
    return (

      alerts.map(alert => (window.innerWidth >= 1200 ? (
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
            {`${Math.max(Math.round(distance(alert.latitude, alert.longitude, latitude, longitude) * 10) / 10).toFixed(2)} miles away`}
          </div>
        </div>
        ) : (
        <div className="alert" key="alert.id">
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

  // componentWillReceiveProps({ data: { newAlert: {
  //   // id,
  //   // latitude,
  //   // longitude,
  //   category,
  //   // url,
  //   // createdAt,
  // }}}) {
  //   toast(category)
  // }
};



export default AlertFeed;
//   return (
  //     <div className="feed">
  //     <span>{`Current search radius: ${range} miles`}</span>
  //       <Query query={GET_ALERTS} variables={{ latitude, longitude, range }}>
  //         {({ loading, error, data, subscribeToMore, ...result }) => {
  //           console.log('result: ', result);
  //           if (loading) return <p> Loading...</p>;
  //           if (error) return <p>Error fetching alerts...</p>;
  
  //           if (!unsubscribe) {
  //             console.log('inside unsubscribe function');
  //             unsubscribe = subscribeToMore({
  //               document: NEW_ALERT,
  //               updateQuery: (prev, { subscriptionData }) => {
  //                 console.log('prev: ', prev);
  //                 console.log('subscriptionData: ', subscriptionData)
  //                 if (!subscriptionData.data) return prev;
  //                 const { newAlert } = subscriptionData.data;
  //                 return {
  //                   ...prev,
  //                   getAlerts: [...prev.getAlerts, newAlert],
  //                 };
  //               },
  //             });
  //           }
  
  //           if (data.getAlerts.length === 0) return <p>{`Currently no alerts within ${range} miles. Consider expanding your search`}</p>;
  //           console.log('GET ALERTS DATA: ', data);
  //           return (
  
  //             data.getAlerts.map(alert => ( window.innerWidth >= 1200 ? (
  //               <div className="alert" key="alert.id">
  //                 {`Category: ${alert.category}`}
  //                 <br />
  //                 {moment(alert.createdAt).fromNow()}
  //                 <br />
  //                 {`${Math.max(Math.round(distance(alert.latitude, alert.longitude, latitude, longitude) * 10) / 10).toFixed(2)} miles away`}
  //               </div>
  //             ): (alert.url !== null ? (
  //               <div className="alert" key="alert.id">
  //                 <div className="image-container">
  //                   <img src={alert.url} width='200' height='145' />
  //                 </div>
  //                 <div className="alert-info-container">
  //                 {`Category: ${alert.category}`}
  //                 <br />
  //                 {moment(alert.createdAt).fromNow()}
  //                 <br />
  //                 {`${Math.max(Math.round(distance(alert.latitude, alert.longitude, latitude, longitude) * 10) / 10).toFixed(2)} miles away`}
  //                 </div>
  //               </div>
  //             ) : (
  //               <div className="alert" key="alert.id">
  //                 <div className="alert-info-container">
  //                 {`Category: ${alert.category}`}
  //                 <br />
  //                 {moment(alert.createdAt).fromNow()}
  //                 <br />
  //                 {`${Math.max(Math.round(distance(alert.latitude, alert.longitude, latitude, longitude) * 10) / 10).toFixed(2)} miles away`}
  //                 </div>
  //               </div>
  //             )
  //             )))
  //           )
  
  //         }}
  //       </Query>
  //     </div>
  //   )
//   }
// };

