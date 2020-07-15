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
  
  const ISM = ISMRaw.ISM.Control;
  const ISMControls = ISM
    .filter((control) => control.Description[0].includes(descriptionFilter))
	  .filter((control) => control.Guideline[0].includes(guidelineFilter))
	  .filter((control) => control.Identifier[0].includes(identifierFilter))
    .map((control) => <ISMControl key={control.Identifier[0]} control={control} />);

  const handleDescriptionChange = e => setDescriptionFilter(e.target.value);
	const handleGuidelineChange = e => setGuidelineFilter(e.target.value);
	const handleIdentifierChange = e => setIdentifierFilter(e.target.value);

	const guidelines = [...new Set(ISM
	  .map((control) => control.Guideline[0]))];

	const guidelineOptions = guidelines
  	.map((guideline) => <option key={guideline} value={guideline}>{guideline}</option>);

  return (
    <div className="App container">
      <div className="modal-header">
        <h4 className="title">Search</h4>
      </div>
      <div className="htmlFor=m-group row filters">
		    <label
		      htmlFor="description"
		      className="col-sm-2 col-htmlFor=m-label">
		      Description
		    </label>
        <input
		      id="description"
          value={descriptionFilter}
          type="text"
				  onChange={handleDescriptionChange}
		      className="htmlFor=m-control col-sm-10"
        />
      </div>
      <div className="htmlFor=m-group row">
		    <label
		      htmlFor="guideline"
		      className="col-sm-2 col-htmlFor=m-label">
		      Guideline
		    </label>
		    <select
				  name="guideline"
				  id="guideline"
		      onChange={handleGuidelineChange}
		      className="htmlFor=m-control col-sm-10">
		      <option value=""></option>
				  {guidelineOptions}
		    </select>
		  </div>
      <div className="htmlFor=m-group row">
		    <label
		      htmlFor="identifier"
		      className="col-sm-2 col-htmlFor=m-label">
				  Identifier
		    </label>
		    <input
		      id="identifier"
		      value={identifierFilter}
		      type="text"
		      onChange={handleIdentifierChange}
		      className="htmlFor=m-controli col-sm-10"
		    />
		  </div>
      <div className="modal-header">
        <h4 className="title">Controls ({ISMControls.length})</h4>
      </div>
      <div className="row">
        {ISMControls}
	    </div>
    </div>
  );
}
export default App;
