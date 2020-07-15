import React from 'react';
import './ISMControl.css';
import ScrollableAnchor from 'react-scrollable-anchor'

function ISMControl(props) {
  return (
    <div className="card control">
      <ScrollableAnchor id={props.control.Identifier[0]}>
        <div className="card-header control-identifier">
	        {props.control.Identifier}
	      </div>
	    </ScrollableAnchor>
	    <ul className="list-group list-group-flush">
      <li className="list-group-item control-guideline">
        {props.control.Guideline}
      </li>
	    <li className="list-group-item control-section">
	      {props.control.Section}
	    </li>
	    <li className="list-group-item control-topic">
	      {props.control.Topic}
	    </li>
	    <li className="list-group-item control-applicability">
	      Applicability:  
	      {props.control.OFFICIAL === "Yes" ? " O " : " "}
	      {props.control.PROTECTED === "Yes" ? "P " : ""}
	      {props.control.SECRET === "Yes" ? "S " : ""}
	      {props.control.TOP_SECRET === "Yes" ? "TS " : ""}
	    </li>
	  </ul>
	  <div className="card-body control-description">
  	    {props.control.Description}
	  </div>
	  <div className="card-footer control-revision control-updated">
	      Revision: {props.control.Revision} Updated: {props.control.Updated}
	  </div>
    </div>
  );
}

export default ISMControl;
