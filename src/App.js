import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React, { useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import './App.css';
import ISMControl from './ISMControl.js';
import ISMRaw from './ISM.json';
import 'bootstrap/dist/css/bootstrap.css';

const App = () => {
  const [descriptionFilter, setDescriptionFilter] = useState(
    ''
  );

  const [guidelineFilter, setGuidelineFilter] = useState(
    ''
  );

  const [identifierFilter, setIdentifierFilter] = useState(
    ''
  );

  const [officialFilter, setOfficialFilter] = useState(
    ''
  );

  const [protectedFilter, setProtectedFilter] = useState(
    ''
  );

  const [secretFilter, setSecretFilter] = useState(
    ''
  );

  const [topSecretFilter, setTopSecretFilter] = useState(
    ''
  );

  const ISM = ISMRaw.ISM.Control;
  const ISMControls = ISM
    .filter((control) => control.Description.toLowerCase().includes(descriptionFilter.toLowerCase()))
    .filter((control) => control.Guideline.toLowerCase().includes(guidelineFilter.toLowerCase()))
    .filter((control) => control.Identifier.toLowerCase().includes(identifierFilter.toLowerCase()))
    .filter((control) => control.OFFICIAL.toLowerCase().includes(officialFilter.toLowerCase()))
    .filter((control) => control.PROTECTED.toLowerCase().includes(protectedFilter.toLowerCase()))
    .filter((control) => control.SECRET.toLowerCase().includes(secretFilter.toLowerCase()))
    .filter((control) => control.TOP_SECRET.toLowerCase().includes(topSecretFilter.toLowerCase()))
    .sort((controlA, controlB) => controlA.Identifier - controlB.Identifier)
    .map((control) => <ISMControl key={control.Identifier} control={control} />);

  const handleDescriptionChange = e => setDescriptionFilter(e.target.value);
  const handleGuidelineChange = e => setGuidelineFilter(e.target.value);
  const handleIdentifierChange = e => setIdentifierFilter(e.target.value);
  const handleOfficialChange = e => setOfficialFilter(e.target.value);
  const handleProtectedChange = e => setProtectedFilter(e.target.value);
  const handleSecretChange = e => setSecretFilter(e.target.value);
  const handleTopSecretChange = e => setTopSecretFilter(e.target.value);

  const guidelines = [...new Set(ISM
    .map((control) => control.Guideline))];

  const guidelineOptions = guidelines
    .map((guideline) => <option key={guideline} value={guideline}>{guideline}</option>);

  return (
    <div className="App container">
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
      <div className="form-group row">
        <label
          htmlFor="official"
          className="col-sm-2 col-form-label">
          Official
		    </label>
        <select
          id="official"
          onChange={handleOfficialChange}
          className="form-control col-sm-10">
          <option value=""></option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="form-group row">
        <label
          htmlFor="protected"
          className="col-sm-2 col-form-label">
          Protected
		    </label>
        <select
          id="protected"
          onChange={handleProtectedChange}
          className="form-control col-sm-10">
          <option value=""></option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="form-group row">
        <label
          htmlFor="secret"
          className="col-sm-2 col-form-label">
          Secret
		    </label>
        <select
          id="secret"
          onChange={handleSecretChange}
          className="form-control col-sm-10">
          <option value=""></option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="form-group row">
        <label
          htmlFor="topSecret"
          className="col-sm-2 col-form-label">
          Top Secret
		    </label>
        <select
          id="topSecret"
          onChange={handleTopSecretChange}
          className="form-control col-sm-10">
          <option value=""></option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
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
