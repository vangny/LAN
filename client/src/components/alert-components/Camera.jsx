import React, { Component } from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

const AlertCamera = () => {
  // Stream conversion code based on react-html5-camera-photo library
  const dataURItoConvert = (dataURI) => {
    let byteString = atob(dataURI.split(',')[1]);

    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    let arrBuff = new ArrayBuffer(byteString.length);
    let unitArr = new Uint8Array(arrBuff);

    for (let i = 0; i < byteString.length; ++i) {
      unitArr[i] = byteString.charCodeAt(i);
    }
    let blob = new Blob([arrBuff], { type: mimeString });
    return blob;
  };

  const padWithZeroNumber = (num, width) => {
    num = num + '';
    return num.length >= width ? num : new Array(width - num.length + 1)
      .join('0') + num;
  };

  const getFileExtention = (blobType) => {
    let ext = IMAGE_TYPES.PNG;

    if (blobType === 'image/jpeg') {
      ext = IMAGE_TYPES.JPG;
    }
    return ext;
  };

  const getFileName = (imageNum, blobType) => {
    const prefix = 'photo';
    const photoNumber = padWithZeroNumber(imageNum, 4);
    const ext = getFileExtention(blobType);

    return `${prefix}-${photoNumber}.${ext}`;
  };

  const downloadImageFileFromConverted = (blob, imageNum) => {
    window.URL = window.webkitURL || window.URL;

    let anchor = document.createElement('a');
    anchor.download = getFileName(imageNumber, blob.type);
    anchor.href = window.URL.createObjectURL(blob);
    let mouseEvent = document.createEvent('MouseEvents');
    mouseEvent.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    anchor.dispatchEvent(mouseEvent);
  };

  const downloadImageFile = (dataUri, imageNum) => {
    let blob = dataURItoConvert(dataUri);
    downloadImageFileFromConverted(blob, imageNum);
  };

  let imageNumber = 0;

  const onTakePhoto = (dataUri) => {
    console.log('photo snapped!');
    downloadImageFile(dataUri, imageNumber);
    imageNumber += 1;
  };

  const onCameraError = (error) => {
    console.error('onCameraError', error);
  };

  const onCameraStart = (stream) => {
    console.log('onCameraStart', stream);
  };

  const onCameraStop = () => {
    console.log('Camera stream has ended');
  };

  return (
    <Camera
      onTakePhoto={(dataUri) => { onTakePhoto(dataUri); }}
      onCameraError={(error) => { onCameraError(error); }}
      idealFacingMode={FACING_MODES.ENVIRONMENT}
      idealResolution={{ width: 2500, height: 3000 }}
      imageType={IMAGE_TYPES.JPG}
      imageCompression={0.97}
      isMaxResolution={false}
      isImageMirror={false}
      isDisplayStartCameraError={true}
      sizeFactor={1}
      onCameraStart={(stream) => { onCameraStart(stream); }}
      onCameraStop={() => { onCameraStop(); }}
      autoPlay={true}
    />

  );
};

export default AlertCamera;
