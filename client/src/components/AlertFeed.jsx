import React from 'react';
import axios from 'axios';
import moment from 'moment';

const AlertFeed = ({ alerts }) => {
  return alerts? (
    <div className="feed">
      {alerts.map(alert => (
    <div className="alert" key="alert.id">
      {`Category: ${alert.category}`}
      <br/>
      {moment(alert.createdAt).fromNow()}
    </div>
      ))}
    </div>
  ) : <div className="feed">
      <p>No local alerts currently</p>
      </div>
};

// return alerts ? alerts.map(alert => (
//   <div className="alert" key="alert.id">
//     {`Category: ${alert.category}`}
//     <br/>
//     {moment(alert.createdAt).fromNow()}
//   </div>
// )) : <p>Loading feed...</p>;

export default AlertFeed;
