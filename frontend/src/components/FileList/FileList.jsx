import React from 'react';
import Capsule from '../Capsule/Capsule';
import './FileList.scss';

const FileList = ({ files = [], open = false }) => (
  <ul id="FileList" className={`${open}`}>
    <h4>Video Queue</h4>
    {files.map(({ name, status }) => <Capsule name={name} status={status} />)}
  </ul>
);

export default FileList;
