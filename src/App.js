import React, { useState } from 'react';
import './App.css';
import ISMControl from './ISMControl.js';
import ISMRaw from './ISM.json';
import 'bootstrap/dist/css/bootstrap.css';

const App = () => {
  const [ descriptionFilter, setDescriptionFilter ] = useState(
    ''
  );

	const [ guidelineFilter, setGuidelineFilter ] = useState(
		''
	);

	const [ identifierFilter, setIdentifierFilter ] = useState(
		''
	);
  
  const ISM = Object.entries(ISMRaw.ISM.Control);
  const ISMControls = ISM
    .filter((control) => control[1].Description.includes(descriptionFilter))
	  .filter((control) => control[1].Guideline.includes(guidelineFilter))
	  .filter((control) => control[1].Identifier.includes(identifierFilter))
    .map((control) => <ISMControl key={control[1].Identifier} control={control[1]} />);

  const handleDescriptionChange = e => setDescriptionFilter(e.target.value);
	const handleGuidelineChange = e => setGuidelineFilter(e.target.value);
	const handleIdentifierChange = e => setIdentifierFilter(e.target.value);

	const guidelines = [...new Set(ISM
	  .map((control) => control[1].Guideline))];

	const guidelineOptions = guidelines
  	.map((guideline) => <option value={guideline}>{guideline}</option>);

  return (
    <div className="App container">
      <div className="modal-header">
        <h4 className="title">Search</h4>
      </div>
      <div className="form-group row filters">
		    <label
		      for="description"
		      className="col-sm-2 col-form-label">
		      Description
		    </label>
        <input
		      id="description"
          value={descriptionFilter}
          type="text"
				  onChange={handleDescriptionChange}
		      className="form-control col-sm-10"
        />
      </div>
      <div className="form-group row">
		    <label
		      for="guideline"
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
		      for="identifier"
		      class="col-sm-2 col-form-label">
				  Identifier
		    </label>
		    <input
		      id="identifier"
		      value={identifierFilter}
		      type="text"
		      onChange={handleIdentifierChange}
		      className="form-controli col-sm-10"
		    />
		  </div>
      <div className="modal-header">
        <h4 className="title">Controls</h4>
      </div>
      <div className="row">
        {ISMControls}
	    </div>
    </div>
  );
}
export default App;
