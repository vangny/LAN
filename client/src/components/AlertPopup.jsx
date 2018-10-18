import React from 'react';

const AlertPopup = ({ alert, exitAlert }) => {

  const alertImg = (alertUrl) => {
    return alertUrl !== undefined ? (
      <img src={alertUrl} />
    ) : null;
  };

  return (
    <div className="alert-popup-modal-container">
      <div className="alert-popup-container">
        <div className="alert-popup">
          <div className="img-container">
            picture
            {alertImg(alert.url)}
          </div>
          <div className="alert-info-container">
            <div className="alert-category"><span>alert category</span></div>
            <div className="alert-location"><span>location of alert</span></div>
            <div className="alert-time"><span>time of alert</span></div>
            <div className="alert-notes"><p>alert notes</p></div>
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
