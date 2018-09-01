import React from 'react';
import './Capsule.scss';

const truncate = (name, chars) => name.length > chars && `${name.slice(chars)}...`;

const Capsule = ({
  name, status, progress, open,
}) => (
  <div flex="none" className="Capsule capsule-arms">
    <div className={`row capsule-body ${open}`}>

      <div className={`display ${status}`}>
        <h5>{truncate(name, 25)}: {status}</h5>
        <h6>{progress}%</h6>

        {status === 'ready' && 'play'}
      </div>
    </div>
  </div>
);

export default Capsule;
