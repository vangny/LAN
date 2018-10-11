import React from 'react';
import axios from 'axios';
import moment from 'moment';

const AlertFeed = ({ alerts }) => {

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
