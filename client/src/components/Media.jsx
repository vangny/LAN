import React, { Component } from 'react';

export default class Media extends Component {
  constructor(props) {
    super(props);

    this.state = {
      media: '',
    };

    this.getMedia = this.getMedia.bind(this);
  }

  componentDidMount() {
    this.getMedia();
  }

  getMedia() {
    // axios.get('/api/media')
    //   .then((res) => {
    //     // console.log(res.data);
    //     this.setState({
    //       media: res.data,
    //     });
    //   });
    const { latitude, longitude } = this.props;
    const range = 10;
    const query = `
    query GetAlerts($latitude: Float, $longitude: Float, $range: Float) {
       getAlerts(latitude: $latitude, longitude: $longitude, range: $range){
        id
        category
        url
        createdAt

      }
    }
    `;

    fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { latitude, longitude, range },
      }),
    })
      .then(response => response.json())
      .then((data) => {
        console.log('Alert feed: ', data);
        this.setState({
          media: data.data.getAlerts,
        });
      });
  }

  render() {
    const { media } = this.state;

    return media ? (
      <div>
        {media.map((file) => {
          if (file.url) {
            // console.log(file.url);
            return <img src={file.url} hspace="5" width='200' height='145' />;
          }
        }
        )}
      </div>
    ) : null;
  }
}
