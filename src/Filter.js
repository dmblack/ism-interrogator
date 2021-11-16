import debounce from 'lodash.debounce';
import './Filter.css';
import { React, useEffect } from 'react';

const Filter = (props) => {
  const handleChange = event => {
    emitChangeDebounced(event);
  }

  const emitChange = (event) => {
    switch(event.context) {
      case 'description': 
        props.handleDescriptionChange(event.value);
        break;
      case 'guideline':
        props.handleGuidelineChange(event.value);
        break;
      case 'identifier':
        props.handleIdentifierChange(event.value);
        break;
      case 'version':
        props.handleVersionChange(event.value);
        break;
      default:
        break;
    }
  }
  
  const emitChangeDebounced = debounce(emitChange, 250);

  useEffect(() => { 
    emitChangeDebounced.cancel()
   }, [emitChangeDebounced])

  return (
    <form className="filters">
      <div className="filter form-group row">
        <label
          htmlFor="version"
          className="col-sm-2 col-form-label">
          Version
        </label>
        <div className="col-sm-10">
          <select
            name="version"
            id="version"
            onChange={(e) => { handleChange({ context: 'version', value: e.target.value })}}
            className="form-control">
            {props.versionOptions}
          </select>
        </div>
      </div>
      <div className="filter form-group row">
        <label
          htmlFor="description"
          className="col-sm-2 col-form-label">
          Description
        </label>
        <div className="col-sm-10">
          <input
            minLength={2}
            id="description"
            defaultValue={props.interrogate.descriptionFilter}
            type="text"
            onChange={(e) => { handleChange({ context: 'description', value: e.target.value })}}
            className="form-control"
          />
        </div>
      </div>
      <div className="filter form-group row">
        <label
          htmlFor="guideline"
          className="col-sm-2 col-form-label">
          Guideline
        </label>
        <div className="col-sm-10">
          <select
            name="guideline"
            id="guideline"
            onChange={(e) => { handleChange({ context: 'guideline', value: e.target.value })}}
            className="form-control">
            <option value=""></option>
            {props.guidelineOptions}
          </select>
        </div>
      </div>
      <div className="filter form-group row">
        <label
          htmlFor="identifier"
          className="col-sm-2 col-form-label">
          Identifier
        </label>
        <div className="col-sm-10">
          <input
            minLength={1}
            id="identifier"
            defaultValue={props.interrogate.identifierFilter}
            type="text"
            onChange={(e) => { handleChange({ context: 'identifier', value: e.target.value })}}
            className="form-control"
            data-tip="Separate multiple with ','"
          />
        </div>
      </div>
    </form>
  );
}

export default Filter;
