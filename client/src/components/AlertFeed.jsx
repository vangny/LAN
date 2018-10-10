import React from 'react';
import axios from 'axios';
import moment from 'moment';

const AlertFeed = ({ alerts }) => {
  return (
    <div className="feed">
      {alerts.map(alert => (
    <div className="alert" key="alert.id">
      {`Category: ${alert.category}`}
      <br/>
      {moment(alert.createdAt).fromNow()}
    </div>
      ))}
    </div>
  );
};

export default AlertFeed;
