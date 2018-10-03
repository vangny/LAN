import React from 'react';
import moment from 'moment';

const AlertFeed = ({ alerts }) => {
  const alertFeed = () => {
    return alerts ? alerts.map(alert => (
      <div className="alert" key={alert.id}>
        {`Category: ${alert.category}`}
        <br/>
        {moment(alert.createdAt).fromNow()}
      </div>
    )) : (<p>Loading feed...</p>);
  }

  return (
    <div className="feed">
      {/* <div id="alertFeed"> */}
        {alertFeed()}
      {/* </div> */}
    </div>
  );
};

export default AlertFeed;
