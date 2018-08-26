import React, { PureComponent } from 'react';
import './FileUpload.scss';
import io from 'socket.io-client';

class FileUpload extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
    };
    const socket = io.connect();
    socket.on('server', (data) => {
      console.log(data);
      socket.emit('client', { my: 'data' });
    });
  }

  componentWillMount() {
  }

  render() {
    const { url } = this.state;

    return (
      <section id="FileUpload">
        <pre>{url}</pre>
      </section>
    );
  }
}

export default FileUpload;
