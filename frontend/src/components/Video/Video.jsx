import React, { PureComponent } from 'react';
import axios from 'axios';
import './Video.scss';

const { API_URL } = process.env;

class Video extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      outputs: [],
    };
  }

  componentWillMount() {
    axios.get(`${API_URL}/files/:fileId`)
      .then(({ data }) => this.setState(({
        outputs: data,
      })));
  }

  render() {
    const { outputs } = this.state;

    return (
      <main id="Video">
        <video> {/* eslint-disable-line jsx-a11y/media-has-caption */}
          <source src={outputs.url} />
        </video>
      </main>
    );
  }
}

export default Video;
