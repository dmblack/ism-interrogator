import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React, { useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import './Filter.css';
import 'bootstrap/dist/css/bootstrap.css';

const Filter = (props) => {
  const guidelineOptions = props.guidelineOptions;

  const handleDescriptionChange = e => props.onDescriptionFilterChange(e.target.value);
	const handleGuidelineChange = e => props.onGuidelineFilterChange(e.target.value);
	const handleIdentifierChange = e => props.onIdentifierFilterChange(e.target.value);

  return (
    <div className="Filter container">
      <div className="modal-header">
        <h4 className="title" id="search">Search</h4>
      </div>
      <div className="form-group row filters">
		    <label
		      htmlFor="description"
		      className="col-sm-2 col-form-label">
		      Description
		    </label>
        <DebounceInput
          minLength={2}
          debounceTimeout={350}
		      id="description"
          value={props.descriptionFilter}
          type="text"
				  onChange={handleDescriptionChange}
		      className="form-control col-sm-10"
        />
      </div>
      <div className="form-group row">
		    <label
		      htmlFor="guideline"
		      className="col-sm-2 col-form-label">
		      Guideline
		    </label>
		    <select
				  name="guideline"
				  id="guideline"
		      onChange={handleGuidelineChange}
		      className="form-control col-sm-10">
		      <option value=""></option>
				  {guidelineOptions}
		    </select>
		  </div>
      <div className="form-group row">
		    <label
		      htmlFor="identifier"
		      className="col-sm-2 col-form-label">
				  Identifier
		    </label>
		    <DebounceInput
		      minLength={1}
		      debounceTimeout={350}
		      id="identifier"
		      value={props.identifierFilter}
		      type="text"
		      onChange={handleIdentifierChange}
		      className="form-control col-sm-10"
          data-tip="Separate multiple with ','"
		    />
		  </div>
    </div>
  );
}
export default Filter;
