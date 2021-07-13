import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React, { useEffect, useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import './App.css';
import ISMControl from './ISMControl.js';
import ISMRaw from './ISM.json';
import 'bootstrap/dist/css/bootstrap.css';
import {
  useLocation
} from "react-router-dom";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

const App = () => {
  /**
   * Handles populating our controls from URL
   * 
   * We use the identifierFilter feature to present them by default.
   * 
   * If the query string includes controls, set it as opening state.
   *  if not; simply set '' as opening state.
   */
  const urlQueryControls = useQuery().get('controls');
  const urlControls = urlQueryControls === null
    ? ''
    : urlQueryControls;
  /**
   * As above, we use the same behavior to populate tagged controls.
   */
  const urlQueryControlsTagged = useQuery().get('tagged');
  const urlControlsTagged = urlQueryControlsTagged === null
    ? []
    : urlQueryControlsTagged.split(',');

  const ISM = ISMRaw.ISM.Control.sort((controlA, controlB) => controlA.Identifier - controlB.Identifier);

  const [ interrogate, setInterrogate ] = useState({
    controls: ISM,
    controlList: ISM,
    controlsTagged: urlControlsTagged,
    descriptionFilter: '',
    guidelineFilter: '',
    identifierFilter: urlControls
  });

  useEffect(() => {
    setInterrogate((previousState) => ({
      ...previousState,
      controlList: interrogate.controls
        .filter(control => control.Description.toLowerCase().includes(interrogate.descriptionFilter.toLowerCase()))
        .filter(control => control.Guideline.toLowerCase().includes(interrogate.guidelineFilter.toLowerCase()))
        .filter(control => (interrogate.identifierFilter.split(',')[0] === '')
          ? true
          : interrogate.identifierFilter.split(',').includes(control.Identifier))
    }))
  }, [interrogate.controls, interrogate.descriptionFilter, interrogate.guidelineFilter, interrogate.identifierFilter])

  const handleDescriptionChange = e => setInterrogate({...interrogate, descriptionFilter: e.target.value});
	const handleGuidelineChange = e => setInterrogate({...interrogate, guidelineFilter: e.target.value});
	const handleIdentifierChange = e => setInterrogate({...interrogate, identifierFilter: e.target.value});

  const handleTagControl = identifier => {
    const newTaggedControls = interrogate.controlsTagged.includes(identifier)
      ? interrogate.controlsTagged.filter(control => control !== identifier)
      : [...interrogate.controlsTagged, identifier]
    
    setInterrogate({...interrogate, controlsTagged: newTaggedControls})
  }

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
          value={interrogate.descriptionFilter}
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
          value={interrogate.identifierFilter}
          type="text"
          onChange={handleIdentifierChange}
          className="form-control col-sm-10"
          data-tip="Separate multiple with ','"
        />
      </div>
      <div className="modal-header">
        <h4 className="control-counter">Controls ({interrogate.controlList.length})</h4>
        <h4 className="control-counter-tagged">{interrogate.controlsTagged.length > 0 && 'Tagged (' + interrogate.controlsTagged.length + ')'}</h4>
      </div>
      <div className="list-group">
        {
        interrogate.controlList
          .map((control) => <ISMControl key={control.Identifier} control={control} tagged={interrogate.controlsTagged.includes(control.Identifier)} tag={() => { handleTagControl(control.Identifier)}}/>)
        }
      </div>
    </div>
  );
}
export default App;
