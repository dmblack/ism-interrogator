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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'


const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

const App = () => {
  const { hash } = useLocation();

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
    identifierFilter: urlControls,
    searchCollapse: false
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

    // if no hash link, scroll to top
    if (hash === '') {
      window.scrollTo(0, 0);
    }
    // else scroll to id
    else {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView();
        }
      }, 0);
    }
  }, [interrogate.controls, interrogate.descriptionFilter, interrogate.guidelineFilter, interrogate.identifierFilter, hash])

  const handleDescriptionChange = e => setInterrogate({...interrogate, descriptionFilter: e.target.value});
	const handleGuidelineChange = e => setInterrogate({...interrogate, guidelineFilter: e.target.value});
	const handleIdentifierChange = e => setInterrogate({...interrogate, identifierFilter: e.target.value});
  const handleSearchCollapse = e => setInterrogate({...interrogate, searchCollapse: !interrogate.searchCollapse})

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
      <div className="flex-row modal-header" onClick={handleSearchCollapse} >
        <h4 className={`d-flex w-100 justify-content-between collapse-content ${interrogate.searchCollapse ? 'collapsed' : 'expanded'}`} id="search">Search</h4>
        <FontAwesomeIcon
          className={`chevron collapse-content ${interrogate.searchCollapse ? 'collapsed' : 'expanded'}`}
          icon={faChevronUp}
          size="1x"
          />
        <FontAwesomeIcon
          className={`chevron collapse-content ${interrogate.searchCollapse ? 'expanded' : 'collapsed'}`}
          icon={faChevronDown}
          size="1x"
        />
      </div>
      <div className={`collapse-content ${interrogate.searchCollapse ? 'collapsed' : 'expanded'}`}
        aria-expanded={interrogate.searchCollapse}>
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
      </div>
      <div className="modal-header">
        <h4 className="control-counter">Controls ({interrogate.controlList.length})</h4>
        <h4 className="control-counter-tagged">{interrogate.controlsTagged.length > 0 && 'Tagged (' + interrogate.controlsTagged.length + ')'}</h4>
      </div>
      <div className="list-group">
        {
        interrogate.controlList
          .map((control) => <ISMControl control={control} key={control.Identifier} tag={() => { handleTagControl(control.Identifier)}} tagged={interrogate.controlsTagged.includes(control.Identifier)} test={() => { console.log('Test')}} />)
        }
      </div>
    </div>
  );
}
export default App;
