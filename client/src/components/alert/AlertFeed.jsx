import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';

// const AlertFeed = ({ alerts }) => {
//   const alertFeed = () => {
//     return alerts ? alerts.map(alert => (
//       <div className="alert" key={alert.id}>
//         {`Category: ${alert.category}`}
//         <br/>
//         {moment(alert.createdAt).fromNow()}
//       </div>
//     )) : (<p>Loading feed...</p>);
//   }

//   return (
//     <div className="feed">
//       {/* <div id="alertFeed"> */}
//       {alertFeed()}
//       {/* </div> */}
//     </div>
//   );
// };

class AlertFeed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alerts: null,
    };
  }

  componentDidMount() {
    const { latitude, longitude } = this.props;

    axios.get(`/api/feed?latitude=${latitude}&longitude=${longitude}&range=10`)
      .then((res) => {
        console.log(res.data);
        this.setState({
          alerts: res.data,
        });
      });
  }

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
    return (
      <div className="feed">
        {this.renderAlerts()}
      </div>
    );
  }
}

export default AlertFeed;
