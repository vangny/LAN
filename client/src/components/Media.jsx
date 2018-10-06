import React, { Component } from 'react';
import axios from 'axios';

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
    const query = `
    {
      getMedia {
        id
        url
      }
    }`;
    fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ query })
    })
      .then(response => response.json())
      .then((mediaFeed) => {
        console.log('returning media feed: ', mediaFeed)
        this.setState({
          media: mediaFeed.data.getMedia,
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
            return <img src={file.url} hspace="5" width='200' height='150' />;
          }
        }
        )}
      </div>
    ) : null;
  }
}
