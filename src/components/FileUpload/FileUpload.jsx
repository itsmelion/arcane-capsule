import React, { PureComponent } from 'react';
import './FileUpload.scss';
import io from 'socket.io-client';
import Resumable from 'resumablejs';

class FileUpload extends PureComponent {
  constructor(props) {
    super(props);
    this.socket = io.connect();
    this.r = new Resumable({
      target: '/upload',
      query: { path: 'uploads' },
      simultaneousUploads: 2,
      setChunkTypeFromFile: true,
      prioritizeFirstAndLastChunk: true,
    });
  }

  componentDidMount() {
    this.socket.on('client', data => console.log('hi from client', data));
    this.r.assignDrop(document.getElementById('upload'));
    this.r.assignBrowse(document.getElementById('upload'));
    this.r.on('fileAdded', (file, event) => {
      console.log('added', event.target.files, file.fileName);
      this.r.upload();
    });

    this.r.on('complete', () => {
      console.log('FINISHED');
    });
    // this.socket.on('server', data => console.log('hi from server', data));
    // this.socket.emit('client', { mounted: 'componentDidMount' });
  }

  pingSocket = () => {
    fetch('/upload/io');
  }

  render() {
    return (
      <section id="FileUpload">
        <input type="file" name="upload" id="upload" />
        <button type="button" className="button" onClick={this.pingSocket}>pingSocket</button>
      </section>
    );
  }
}

export default FileUpload;
