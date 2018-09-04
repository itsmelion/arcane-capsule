import React from 'react';
import VideoListItem from '../VideoListItem/VideoListItem';
import './FileList.scss';

const FileList = ({ files = [], open = false }) => (
  <ul id="FileList" className={`${open}`}>
    <div className="list-header"><h4>Video Queue</h4></div>

    {files.map(({ _id, name, status }) => (
      <VideoListItem key={_id} id={_id} name={name} status={status} />
    ))}

    {files.length === 0 && (
      <h2 className="mv2">Nothing Here sir, <sub>Try to upload some stuff first</sub></h2>
    )}
  </ul>
);

export default FileList;
