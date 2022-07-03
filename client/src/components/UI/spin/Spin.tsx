import React from 'react';

import "./styles.scss"

const Spin = ({size}) => {
  
  return (
    <div className={"loader2 " +  size + "_loader"}>
      <div className="lds-ripple">
        <div/>
        <div/>
        <div/>
        <div/>
      </div>
    </div>

  );
};

export default Spin;