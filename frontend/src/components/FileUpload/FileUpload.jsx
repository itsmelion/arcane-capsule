import React, { PureComponent } from 'react';
import './FileUpload.scss';
import ReactS3Uploader from 'react-s3-uploader';
import axios from 'axios';
import Capsule from '../Capsule/Capsule';

const { API_URL } = process.env;

class FileUpload extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      progress: 0,
      status: 'waiting',
    };
  }

  onUploadProgress = (progress, status, file) => {
    this.setState({ progress, status, name: file.name });
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
      });
  }

  render() {
    const { name, progress, status } = this.state;
    return (
      <section id="FileUpload">
        <Capsule name={name} status={status} />
        <pre><h5>Progress: {progress}%</h5></pre>

        <ReactS3Uploader
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
      </section>
    );
  }
}

export default FileUpload;
