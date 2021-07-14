import React from 'react';
import './ISMControl.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag } from '@fortawesome/free-solid-svg-icons'

const ISMControl = (props) => {
  return (
    <div className="list-group-item list-group-item-action flex-column align-tems-start control" id={props.control.Identifier} onClick={props.tag}>
      <div className="d-flex w-100 justify-content-between control-identifier">
        <h1 className="mb-1">
          {props.control.Identifier}
        </h1>
        <small className="control-applicability">
          [
          {props.control.OFFICIAL === "Yes" ? " OFFICIAL " : " "}
          {props.control.PROTECTED === "Yes" ? "PROTECTED " : ""}
          {props.control.SECRET === "Yes" ? "SECRET " : ""}
          {props.control.TOP_SECRET === "Yes" ? "TOP_SECRET " : ""}
          ]
          {
            props.tagged &&
            <FontAwesomeIcon
              className="tagged"
              icon={faTag}
            />
          }
        </small>
      </div>
      <h4 className="control-guideline">
        {props.control.Guideline.split('Guidelines for ')[1]}
      </h4>
      <h6 className="control-topic">
        {props.control.Topic}
      </h6>
      <p className="mb-1 control-description">
        {props.control.Description}
      </p>
      <div className="d-flex w-100 justify-content-between">
        <p className="mb-1"></p>
        <small className="control-revision-updated">
          Rev:{props.control.Revision} - {props.control.Updated}
        </small>
      </div>
    </div>
  );
}

export default ISMControl;
