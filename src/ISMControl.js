import React from 'react';
import './ISMControl.css';

function ISMControl(props) {
  return (
    <div className="card ISMControl">
      <div className="card-header">
	    <p className="card-title identifier">
	      {props.control.Identifier}
	  </p>
	  </div>
	  <ul className="list-group list-group-flush">
      <li className="list-group-item guideline">
        {props.control.Guideline}
      </li>
	    <li className="list-group-item section">
	      {props.control.Section}
	    </li>
	    <li className="list-group-item topic">
	      {props.control.Topic}
	    </li>
	    <li className="list-group-item applicability">
	      Applicability:  
	      {props.control.OFFICIAL === "Yes" ? "O " : ""}
	      {props.control.PROTECTED === "Yes" ? "P " : ""}
	      {props.control.SECRET === "Yes" ? "S " : ""}
	      {props.control.TOP_SECRET === "Yes" ? "TS " : ""}
	    </li>
	    <li className="list-group-item revision">
	      Revision: {props.control.Revision}
	    </li>
	    <li className="list-group-item updated">
	      Update: {props.control.Updated}
  	  </li>
	  </ul>
	  <div className="card-body">
  	  <p className="card-text description">
  	    {props.control.Description}
  	  </p>
	  </div>
    </div>
  );
}

export default ISMControl;
