import React from 'react';
import axios from 'axios';
import moment from 'moment';

const AlertFeed = ({ alerts }) => {
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
  
  return alerts? (
    <div className="feed">
      {alerts.map(alert => ( window.innerWidth >= 1200 ? (
        <div className="alert" key="alert.id">
          {`Category: ${alert.category}`}
          <br />
          {moment(alert.createdAt).fromNow()}
        </div>
      ) : (alert.url !== null ? (
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
      )))}
    </div>
  ) : (
    <div className="feed">
      <span>No local alerts currently</span>
    </div>
  );
};

// return alerts ? alerts.map(alert => (
//   <div className="alert" key="alert.id">
//     {`Category: ${alert.category}`}
//     <br/>
//     {moment(alert.createdAt).fromNow()}
//   </div>
// )) : <p>Loading feed...</p>;

export default AlertFeed;
