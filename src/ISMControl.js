import React from 'react';
import './ISMControl.css';
import ScrollableAnchor from 'react-scrollable-anchor'

function ISMControl(props) {
  return (
    <div className="list-group-item list-group-item-action flex-column align-tems-start control">
      <ScrollableAnchor id={props.control.Identifier}>
        <div className="d-flex w-100 justify-content-between control-identifier">
	        <h4 className="mb-1">
	          {props.control.Identifier}
	        </h4>
	        <small>
            {props.control.OFFICIAL === "Yes" ? " OFFICIAL " : " "}
            {props.control.PROTECTED === "Yes" ? "PROTECTED " : ""}
            {props.control.SECRET === "Yes" ? "SECRET " : ""}
            {props.control.TOP_SECRET === "Yes" ? "TOP-SECRET " : ""}
	        </small>
	      </div>
	    </ScrollableAnchor>
	    <div className="d-flex w-100 justify-content-between control-applicability">
	      <h5 className="mb-1">
	        Rev:{props.control.Revision} - {props.control.Updated}
	      </h5>
	      <small>
	        {props.control.Guideline}
	      </small>
	    </div>
	    <p className="mb-1">{props.control.Description}</p>
	    <small>{props.control.Section} - {props.control.Topic}</small>
    </div>
  );
}

export default ISMControl;
