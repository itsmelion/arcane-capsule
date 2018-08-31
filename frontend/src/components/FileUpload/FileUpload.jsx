import React, { PureComponent } from 'react';
import './FileUpload.scss';
import ReactS3Uploader from 'react-s3-uploader';
import axios from 'axios';
import io from 'socket.io-client';

const { API_URL } = process.env;

class FileUpload extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      progress: 0,
      status: 'Waiting',
    };
  }

  componentDidMount() {
    this.socket = io.connect(API_URL);
    this.socket.on('client', ({ status }) => this.setState({
      status,
    }));
  }

  onUploadProgress = (progress, status, file) => {
    this.setState({ progress, status, name: file.name });
  }

  onUploadError = (error) => {
    console.log('error', error);
  }

  onUploadFinish = ({ fileKey }, file) => {
    const fileName = file.name;
    axios.post(`${API_URL}/files`, { fileName, fileKey });
  }

  render() {
    const { name, progress, status } = this.state;
    return (
      <section id="FileUpload">
        <pre><h4>Name: {name}</h4></pre>
        <pre><h5>Progress: {progress}% ({status})</h5></pre>

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
