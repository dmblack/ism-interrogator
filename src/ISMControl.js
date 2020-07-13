import React from 'react';
import './ISMControl.css';

function ISMControl(props) {
  return (
    <div className="ISMControl">
      <body>
      <p className="guideline">
        {props.control.Guideline}
      </p>
	    <p className="section">
	      {props.control.Section}
	    </p>
	    <p className="topic">
	      {props.control.Topic}
	    </p>
	    <p className="identifier">
	      {props.control.Identifier}
	    </p>
	    <p className="revision">
	      {props.control.Revision}
	    </p>
	    <p className="updated">
	      {props.control.Updated}
  	  </p>
  	  <p className="description">
  	    {props.control.Description}
  	  </p>
  	  </body>
    </div>
  );
}

export default ISMControl;
