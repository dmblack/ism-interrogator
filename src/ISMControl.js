import React from 'react';
import PropTypes from 'prop-types';
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
          {props.control.OFFICIAL === "Yes" || props.control.OFFICIAL === "true" ? " OFFICIAL " : " "}
          {props.control.PROTECTED === "Yes" || props.control.PROTECTED === "true" ? "PROTECTED " : ""}
          {props.control.SECRET === "Yes" || props.control.SECRET === "true" ? "SECRET " : ""}
          {props.control.TOP_SECRET === "Yes" || props.control.TOP_SECRET === "true" ? "TOP_SECRET " : ""}
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

ISMControl.propTypes = {
    control: PropTypes.shape({
      Description: PropTypes.string.isRequired,
      Guideline: PropTypes.string.isRequired,
      Identifier: PropTypes.string.isRequired,
      OFFICIAL: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
      ]),
      PROTECTED: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
      ]),
      Revision: PropTypes.string.isRequired,
      SECRET: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
      ]),
      TOP_SECRET: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
      ]),
      Topic: PropTypes.string.isRequired,
      Updated: PropTypes.string.isRequired
    })
}