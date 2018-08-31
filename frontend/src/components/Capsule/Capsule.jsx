import React from 'react';
import './Capsule.scss';

const Capsule = ({ name, status }) => (
  <div align="around" className="row nowrap Capsule">
    <h4>{name}</h4>
    <h3>{status}</h3>

    <div>play</div>
  </div>
);


export default Capsule;
