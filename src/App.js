import React, { useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
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
  
  const ISM = ISMRaw.ISM.Control;
  const ISMControls = ISM
    .filter((control) => control.Description.includes(descriptionFilter))
	  .filter((control) => control.Guideline.includes(guidelineFilter))
	  .filter((control) => control.Identifier.includes(identifierFilter))
	  .sort((controlA, controlB) => controlA.Identifier - controlB.Identifier)
    .map((control) => <ISMControl key={control.Identifier} control={control} />);

  const handleDescriptionChange = e => setDescriptionFilter(e.target.value);
	const handleGuidelineChange = e => setGuidelineFilter(e.target.value);
	const handleIdentifierChange = e => setIdentifierFilter(e.target.value);

	const guidelines = [...new Set(ISM
	  .map((control) => control.Guideline))];

	const guidelineOptions = guidelines
  	.map((guideline) => <option key={guideline} value={guideline}>{guideline}</option>);

  return (
    <div className="App container">
      <div className="modal-header">
        <h4 className="title">Search</h4>
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
          value={descriptionFilter}
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
		      value={identifierFilter}
		      type="text"
		      onChange={handleIdentifierChange}
		      className="form-control col-sm-10"
		    />
		  </div>
      <div className="modal-header">
        <h4 className="title">Controls ({ISMControls.length})</h4>
      </div>
      <div className="list-group">
        {ISMControls}
	    </div>
    </div>
  );
}
export default App;
