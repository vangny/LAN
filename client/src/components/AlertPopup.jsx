import React from 'react';
import moment from 'moment';

const AlertPopup = ({ alert, exitAlert, latitude, longitude }) => {

  const alertImg = (alertUrl) => {
    return alertUrl !== undefined ? (
      <img src={alertUrl} />
    ) : null;
  };

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
    return Math.max(Math.round(dist * 10) / 10).toFixed(2);
  };

  const direction = (alertLat, alertLong, userLat, userLong) => {
    let lat;
    let long;

    if (alertLat < userLat) {
      lat = 'South';
    } else if (alertLat > userLat) {
      lat = 'North';
    } else {
      lat = '';
    }

    if (alertLong < userLong) {
      long = 'West';
    } else if (alertLong > userLong) {
      long = 'East';
    } else {
      long = '';
    }

    return `${lat} ${long}`;
  };

  const renderNotes = () => {
    return !!alert.notes ? `${alert.notes}` : 'N/A';
  }

  const dist = distance(alert.latitude, alert.longitude, latitude, longitude);
  const dir = direction(alert.latitude, alert.longitude, latitude, longitude);

  return (
    <div className="alert-popup-modal-container">
      <div className="alert-popup-container">
        <div className="alert-popup">
          <div className="popup-img-container">
            {alertImg(alert.url)}
          </div>
          <div className="alert-popup-info-container">
            <div className="alert-category">
              <span className="category-head">Alert Category:&nbsp;</span>
              {/* <br /> */}
              <span className="category">{alert.category}</span>
            </div>
            <div className="alert-location">
              <span className="location-head">Location of Alert:&nbsp;</span>
              {/* <br /> */}
              <span className="location">{`${dist} miles ${dir}`}</span>
            </div>
            <div className="alert-time">
              <span className="time-head">Time of Alert:&nbsp;</span>
              {/* <br /> */}
              <span className="time">{moment(alert.createdAt).calendar()}</span>
            </div>
            <div className="alert-notes">
              <span>Alert Notes:</span>
              {/* <br /> */}
              <div>{renderNotes()}</div>
            </div>
          </div>
          <div className="back-button-container">
            <button type="button" onClick={() => exitAlert()}>
              <i className="fas fa-arrow-left" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertPopup;
