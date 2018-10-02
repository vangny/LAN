import React, { Component } from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

class AlertCamera extends Component {
  constructor(props) {
    super(props);
    this.imageNumber = 0;
    this.state = {
      constraints: { audio: false, video: { width: 400, height: 300 } },
    };
  }

  onTakePhoto(dataUri) {
    // downloadImageFile(dataUri, this.imageNumber);
    // this.imageNumber += 1;
    console.log('photo snapped!');
  }

  onCameraError(error) {
    console.error('onCameraError', error);
  }

  onCameraStart(stream) {
    console.log('onCameraStart');
  }

  onCameraStop() {
    console.log('onCameraStop');
  }

  render() {
    return (
      <Camera
        onTakePhoto={(dataUri) => { this.onTakePhoto(dataUri); }}
        onCameraError={(error) => { this.onCameraError(error); }}
        idealFacingMode={FACING_MODES.ENVIRONMENT}
        idealResolution={{ width: 640, height: 480 }}
        imageType={IMAGE_TYPES.JPG}
        imageCompression={0.97}
        isMaxResolution={false}
        isImageMirror={false}
        isDisplayStartCameraError={true}
        sizeFactor={1}
        onCameraStart={(stream) => { this.onCameraStart(stream); }}
        onCameraStop={() => { this.onCameraStop(); }}
        autoPlay={true}
      />

    );
  }
}

export default AlertCamera;
