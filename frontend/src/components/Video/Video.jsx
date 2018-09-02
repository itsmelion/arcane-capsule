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
    const { match } = this.props;
    axios.get(`${API_URL}/files/${match.params.id}`)
      .then(({ data: { encoderOutputs } }) => this.setState(({
        outputs: encoderOutputs,
      })));
  }

  render() {
    const { outputs } = this.state;

    return (
      <main flex="" fill="" id="Video">
        <video controls autoPlay> {/* eslint-disable-line jsx-a11y/media-has-caption */}
          {outputs && outputs.length && outputs.map(({ _id, url, format }) => (
            <source
              key={_id}
              src={url}
              type={`video/${format}`}
            />
          ))}

          😦 Your browser does not support the video tag. 🚫 📹
        </video>
      </main>
    );
  }
}

export default Video;
