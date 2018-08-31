import React, { PureComponent } from 'react';
import './FileUpload.scss';
import io from 'socket.io-client';
import Resumable from 'resumablejs';

class FileUpload extends PureComponent {
  constructor(props) {
    super(props);
    this.socket = io.connect();
    this.state = {
      upload: {
        name: '',
        progress: false,
      },
    };

    this.r = new Resumable({
      target: '/upload',
      simultaneousUploads: 2,
      setChunkTypeFromFile: true,
      prioritizeFirstAndLastChunk: true,
      chunkSize: 0.8 * 1024 * 1024,
      forceChunkSize: true,
    });

    this.socket.on('client', ({ progress }) => this.setState(({ upload }) => ({
      upload: { ...upload, progress },
    })));

    this.r.on('fileAdded', (file) => {
      this.setState({
        upload: {
          name: file.fileName,
          progress: 'sending',
        },
      });

      this.r.upload();
    });

    this.r.on('complete', () => this.setState(({ upload }) => ({
      upload: { ...upload, progress: 'sent' },
    })));
  }

  componentDidMount() {
    this.r.assignDrop(document.getElementById('upload-label'));
    this.r.assignBrowse(document.getElementById('upload'));
  }

  render() {
    const { upload } = this.state;
    return (
      <section id="FileUpload">
        <pre><h4>Name: {upload.name}</h4></pre>
        <pre><h5>Progress: {upload.progress}</h5></pre>
        <br />

        <label htmlFor="upload" id="upload-label">
          <input type="file" name="upload" id="upload" />
        </label>
      </section>
    );
  }
}

export default FileUpload;
