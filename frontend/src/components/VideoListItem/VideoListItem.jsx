import React from 'react';
import { Link } from 'react-router-dom';
import './VideoListItem.scss';
import iconPlay from './icons8-circled-play-48.png';
import iconEncoding from './icons8-settings-48.png';
import iconError from './icons8-error-64.png';


const VideoListItem = ({ status, id, name }) => (
  <li className="row nowrap VideoListItem" align="around center">
    <div>
      <h4>{name}</h4>
    </div>

    {status === 'completed' && (
      <Link to={`/video/${id}`}>
        <div title={status} className="status play">
          <p>Play</p>
          <img src={iconPlay} alt="See video" />
        </div>
      </Link>
    )}

    {status === 'encoding' && (
      <div title={status} className="status encode">
        <p>Encoding</p>
        <img src={iconEncoding} alt="Video encoding" />
      </div>
    )}

    {status !== 'encoding' && status !== 'completed' && (
      <div title={status} className="status error">
        <p>Error while encoding</p>
        <img src={iconError} alt="Video processing error" />
      </div>
    )}
  </li>
);

export default VideoListItem;
