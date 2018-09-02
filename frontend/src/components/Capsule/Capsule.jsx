import React from 'react';
import './Capsule.scss';

const Capsule = ({
  name, status, progress, open,
}) => (
  <div flex="none" className="Capsule capsule-arms">
    <div className={`row capsule-body ${open}`}>

      <div className={`display ${status}`}>
        <h5>{name}</h5>
        <h6>{(progress > 0 && progress < 100) && `${progress}%`} {status}</h6>
      </div>

    </div>
  </div>
);

export default Capsule;
