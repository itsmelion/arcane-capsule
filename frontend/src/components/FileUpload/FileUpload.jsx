import React, { PureComponent } from 'react';
import './FileUpload.scss';
import ReactS3Uploader from 'react-s3-uploader';
import axios from 'axios';
import Capsule from '../Capsule/Capsule';
import uploadIcon from './icons8-upload-to-cloud-80.png';

const { API_URL } = process.env;
const capsuleInitialState = {
  name: '',
  progress: 0,
  status: 'waiting',
  open: false,
};

const truncate = (name, chars) => name.length > chars && `${name.slice(0, chars)}...`;

class FileUpload extends PureComponent {
  constructor(props) {
    super(props);
    this.toggleList = props.toggleList;
    this.state = {
      ...capsuleInitialState,
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
      .then(() => {
        this.setState({ ...capsuleInitialState });
        this.toggleList(true);
      });
  }

  render() {
    const {
      name, progress, status, open,
    } = this.state;

    return (
      <section id="FileUpload" flex="auto" row="" align="center center">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="upload" id="upload-label" hidden={open}>
          <img src={uploadIcon} alt="Upload file icon" />

          <ReactS3Uploader
            id="upload"
            name="upload"
            hidden
            signingUrl="/s3/sign"
            signingUrlMethod="GET"
            s3path="raw/"
            onProgress={this.onUploadProgress}
            onError={this.onUploadError}
            onFinish={this.onUploadFinish}
            server={API_URL}
            disabled={open}
          />
        </label>

        <Capsule
          name={truncate(name, 21)}
          status={status}
          progress={progress}
          open={open}
        />
      </section>
    );
  }
}

export default FileUpload;
