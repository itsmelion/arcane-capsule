import React from 'react';
import './FileList.scss';
import Capsule from '../Capsule/Capsule';

const FileList = ({ files = [] }) => (
  <ul id="FileList">
    <h4>Video Queue</h4>
    {files.map(({ name, status }) => <Capsule name={name} status={status} />)}
  </ul>
);


export default FileList;
