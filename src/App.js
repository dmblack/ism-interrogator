import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React, { useState } from 'react';
import './App.css';
import Filter from './Filter.js';
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

  // ISM Control Section
  const ISM = ISMRaw.ISM.Control;
  const ISMControls = ISM
    .filter((control) => control.Description.toLowerCase().includes(descriptionFilter.toLowerCase()))
	  .filter((control) => control.Guideline.toLowerCase().includes(guidelineFilter.toLowerCase()))
	  .filter((control) => (identifierFilter.split(',')[0] === '')
      ? true
      : identifierFilter.split(',').includes(control.Identifier))
	  .sort((controlA, controlB) => controlA.Identifier - controlB.Identifier)
    .map((control) => <ISMControl key={control.Identifier} control={control} />);

  //  Filters are exposed by the Filter.js component.
	const guidelines = [...new Set(ISM
	  .map((control) => control.Guideline))];

	const guidelineOptions = guidelines
  	.map((guideline) => <option key={guideline} value={guideline}>{guideline}</option>);


  // Component
  return (
    <div className="App container">
      <Filter
        guidelineOptions={guidelineOptions}
        onDescriptionFilterChange={setDescriptionFilter}
        descriptionFilter={descriptionFilter}
        onGuidelineFilterChange={setGuidelineFilter}
        guidelineFilter={guidelineFilter}
        onIdentifierFilterChange={setIdentifierFilter}
        identifierFilter={identifierFilter}
      />
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
