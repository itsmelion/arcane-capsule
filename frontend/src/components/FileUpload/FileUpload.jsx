import React, { PureComponent } from 'react';
import './FileUpload.scss';
import ReactS3Uploader from 'react-s3-uploader';
import axios from 'axios';
import Capsule from '../Capsule/Capsule';
import uploadIcon from './icons8-upload-to-cloud-80.png';

const { API_URL } = process.env;

class FileUpload extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      progress: 0,
      status: 'waiting',
      open: false,
    };
  }

  onUploadProgress = (progress, status, file) => {
    this.setState({
      progress, status, name: file.name, open: true,
    });
  }

  onUploadError = (error) => {
    console.warn(error);
    this.setState({ status: 'error' });
  }

  onUploadFinish = ({ fileKey }, file) => {
    const fileName = file.name;
    axios.post(`${API_URL}/files`, { fileName, fileKey })
      .then(({ id }) => {
        this.listenWebhook(id);
        this.setState({ open: false });
      });
  }

  render() {
    const {
      name, progress, status, open,
    } = this.state;

    return (
      <section id="FileUpload" flex="auto" row="" align="center center">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="upload" id="upload-label">
          <img src={uploadIcon} alt="Upload file icon" />

          <ReactS3Uploader
            hidden
            id="upload"
            name="upload"
            signingUrl="/s3/sign"
            signingUrlMethod="GET"
            s3path="raw/"
            onProgress={this.onUploadProgress}
            onError={this.onUploadError}
            onFinish={this.onUploadFinish}
            server={API_URL}
          />
        </label>

        <Capsule name={name} status={status} progress={progress} open={open} />
      </section>
    );
  }
}

export default FileUpload;
