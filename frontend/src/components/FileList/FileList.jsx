import React from 'react';
import './FileList.scss';
import Capsule from '../Capsule/Capsule';

const FileList = ({ files = [] }) => (
  <ul id="FileList">
    {files.map(({ name, status }) => <Capsule name={name} status={status} />)}
  </ul>
);


export default FileList;
