import React, { Component } from 'react';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import { navigate } from '@reach/router';
import { Mutation } from 'react-apollo';
import  gql  from 'graphql-tag';
import AlertCamera from './Camera';
import Modal from './modal';
// import CreatAlertWithMutation from './CreateAlertMutation';


class Alert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: null,
      photoTag: '',
      notes: '',
      modal: '',
    };
    this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
    // this.waitForData = this.waitForData.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.showUploaded = this.showUploaded.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

/* eslint-disable */
  handleDrop(files) {
    console.log(files);
    const { photoTag } = this.state;
    const upload = files.map((file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tags', `${photoTag}`);
      formData.append('upload_preset', 'pnqbmmuw'); // upload preset name
      formData.append('api_key', '491544247472459'); // api key
      formData.append('timestamp', (Date.now() / 1000) | 0);
      // Cloudinary upload request
      return axios.post('https://api.cloudinary.com/v1_1/n3/image/upload', formData, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },

      }).then((res) => {
        const { photo } = this.state;
        const data = res.data;
        const photoURL = data.secure_url;

        this.setState({
          photo: `${photoURL}`,
        }, () => {
          console.log('photo url updated', photo);
        });
        console.log(data);
      });
    });
      // After all files uploaded
    axios.all(upload).then(() => {
      console.log('All photos successfully uploaded');
    });
  }
  /* eslint-enable */

  showUploaded() {
    const { photo } = this.state;
    return photo === null ? (
      <div className="empty">
      Uploaded photo preview will be shown here
      </div>
    )
      : (
        <div className="uploaded-photo-container">
          <img className="uploaded-photo" src={photo} alt="uploaded" />
          <p>
            Photo successfully uploaded!
          </p>
        </div>);
  }

  changeModal(view) {
    this.setState({
      modal: view,
    });
  }

  renderModal() {
    const { modal } = this.state;
    return modal === 'camera' ? (
      <Modal>
        <AlertCamera
          changeModal={this.changeModal.bind(this)}
        />
      </Modal>
    ) : null;
  }

  render() {
    const { modal, photo, notes, photoTag } = this.state;
    const { category, latitude, longitude } = this.props;
    const userId = Number(this.props.userId);
    console.log('alert userId', userId);
    const createAlert = gql`
    mutation CreateAlert($category: String!, $EventId: Int, $latitude: Float!, $longitude: Float!, $notes: String, $photo: String, $photoTag: String, $userId: Int) {
      createAlert(EventId: $EventId, category: $category, latitude: $latitude, longitude: $longitude, notes: $notes, url: $photo, photoTag: $photoTag, userId: $userId ) {
        id
      }
    }
    `;
    // console.log(`category: ${category}\nlatitude: ${latitude}\nlongitude: ${longitude}`);
    return (
      <div className="alert-layout">
        <div className="location-info">
          <h2>
            Disaster Type:
            {' '}
            {category}
          </h2>
        </div>
        <div className="photo-button-container">
          {this.renderModal()}
          <button className="photo-button" type="button" onClick={() => this.changeModal('camera')} />
          <Dropzone
            className="dropzone"
            name="file"
            type="file"
            onDrop={this.handleDrop}
            multiple
            accept="image/*"
          />
        </div>
        <div className="photo-preview">
          {this.showUploaded()}
        </div>
        <div className="photo-tag-container">
          <input type="text" name="photoTag" placeholder="Add tags for your photos here" onChange={this.handleChange} value={photoTag} />
        </div>
        <div className="notes">
          <textarea cols="30" rows="3" type="text" name="notes" placeholder="Enter any additional notes here" onChange={this.handleChange} value={notes} />
        </div>
        <div className="submit">
          <Mutation mutation={createAlert} variables={{ category, latitude, longitude, notes, photo, photoTag, userId }}>
            {(mutate, { loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error creating alert</p>;
              return (
                <button
                  id="submit-alert-button"
                  type="button"
                  onClick={() => {
                    mutate();
                    navigate('/');
                    console.log('Mutation data: ', data);
                  }}
                >
                Create Alert
                </button>
              );
            }}
          </Mutation>
        </div>
      </div>

    );
  }
}

export default Alert;
