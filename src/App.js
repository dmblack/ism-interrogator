import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React, { useEffect, useState } from 'react';
import './App.css';
import ISMControl from './ISMControl.js';
import Filter from './Filter.js';
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
  /**
   * As above, we use the same behavior to populate a version.
   */
  const urlQueryVersion = useQuery().get('version');
  const urlVersion = urlQueryVersion === null
    ? 'current'
    : urlQueryVersion;

  // const ISM = require('./ISM.current.json').ISM.Control.sort((controlA, controlB) => controlA.Identifier - controlB.Identifier);

  const [ interrogate, setInterrogate ] = useState({
    controls: require('./ism/' + urlVersion + '.json').ISM.Control.sort((controlA, controlB) => controlA.Identifier - controlB.Identifier),
    controlList: [],
    controlsTagged: urlControlsTagged,
    descriptionFilter: '',
    guidelineFilter: '',
    identifierFilter: urlControls,
    searchCollapse: false,
    version: 'current'
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
    }));

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
  }, [hash, interrogate.controls, interrogate.descriptionFilter, interrogate.guidelineFilter, interrogate.identifierFilter, interrogate.version])

  const handleDescriptionChange = value => setInterrogate({...interrogate, descriptionFilter: value});
	const handleGuidelineChange = value => setInterrogate({...interrogate, guidelineFilter: value});
	const handleIdentifierChange = value => setInterrogate({...interrogate, identifierFilter: value});
  const handleSearchCollapse = () => setInterrogate({...interrogate, searchCollapse: !interrogate.searchCollapse});
  const handleVersionChange = value => setInterrogate({...interrogate, version: value});

  const handleTagControl = identifier => {
    const newTaggedControls = interrogate.controlsTagged.includes(identifier)
      ? interrogate.controlsTagged.filter(control => control !== identifier)
      : [...interrogate.controlsTagged, identifier]
    
    setInterrogate({...interrogate, controlsTagged: newTaggedControls})
  }

	const guidelines = [...new Set(interrogate.controls
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
        <Filter 
          handleDescriptionChange={handleDescriptionChange}
          handleGuidelineChange={handleGuidelineChange}
          handleIdentifierChange={handleIdentifierChange}
          guidelineOptions={guidelineOptions}
          interrogate={interrogate}
        />
      </div>
      <div className="modal-header">
        <h4 className="control-counter">Controls ({interrogate.controlList.length})</h4>
        <h4 className="control-counter-tagged" onDoubleClick={() => {navigator.clipboard.writeText('http://dmblack.github.io/ism-interrogator/?controls=' + interrogate.controlsTagged.join(','))}} onClick={() => {navigator.clipboard.writeText('http://dmblack.github.io/ism-interrogator/?tagged=' + interrogate.controlsTagged.join(','))}}>{interrogate.controlsTagged.length > 0 && 'Tagged (' + interrogate.controlsTagged.length + ')'}</h4>
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
