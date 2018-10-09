import React, { Component } from 'react';
import moment from 'moment';

class AlertFeed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alerts: null,
    };
  }

  // componentWillMount() {
  //   const { latitude, longitude } = this.props;

  //   const range = 10;

  //   const query = `
  //   query GetAlerts($latitude: Float, $longitude: Float, $range: Float) {
  //      getAlerts(latitude: $latitude, longitude: $longitude, range: $range){
  //       id
  //       category
  //       createdAt
  //     }
  //   }
  //   `;

  //   fetch('/graphql', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Accept: 'application/json',
  //     },
  //     body: JSON.stringify({
  //       query,
  //       variables: { latitude, longitude, range },
  //     }),
  //   })
  //     .then(response => response.json())
  //     .then((data) => {
  //       console.log('Alert feed: ', data);
  //       this.setState({
  //         alerts: data.data.getAlerts,
  //       });
  //     });
  // }

  renderAlerts() {
    const { alerts } = this.state;

    return alerts ? alerts.map(alert => (
      <div className="alert" key="alert.id">
        {`Category: ${alert.category}`}
        <br/>
        {moment(alert.createdAt).fromNow()}
      </div>
    )) : <p>Loading feed...</p>;
  }

  render() {
    const { alerts } = this.props;
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
  }
}

export default AlertFeed;
