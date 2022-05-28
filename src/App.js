import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React, { useEffect, useState } from 'react';
import './App.css';
import ISM from './ISM.js';
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

  const versionsValid = [
    '202203',
    '202112',
    '202109',
    '202106',
    '202104',
    '202103',
    '202101',
    '202012',
    '202011',
    '202010',
    '202009',
    '202008',
    '202007',
    '202006',
    '202005',
    '202004',
    '202003',
    '202001',
    '201912',
    '201911',
    '201910',
    '201909',
    '201908',
    '201907',
    '201906',
    '201905',
    '201904',
    '201903',
    '201902',
    '201901',
    '201811',
  ]
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
   * 
   *   In our case; we also populate to load the last version in the 
   *    array (latest).
   */
  const urlQueryVersion = useQuery().get('version');
  const urlVersion = urlQueryVersion === null
    ? versionsValid[0]
    : urlQueryVersion;
  /**
   * Our Application State
   */
  const [ interrogate, setInterrogate ] = useState({
    controls: require('./ism/' + urlVersion + '.json').ISM.Control.sort((controlA, controlB) => controlA.Identifier - controlB.Identifier),
    controlList: [],
    controlsTagged: urlControlsTagged,
    descriptionFilter: '',
    guidelineFilter: '',
    identifierFilter: urlControls,
    searchCollapse: false,
    version: urlVersion,
    versionsValid: versionsValid
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
  const handleVersionChange = value => setInterrogate({...interrogate, version: value, controls: require('./ism/' + value + '.json').ISM.Control.sort((controlA, controlB) => controlA.Identifier - controlB.Identifier)});

	const guidelines = [...new Set(interrogate.controls
	  .map((control) => control.Guideline))];

	const guidelineOptions = guidelines
  	.map((guideline) => <option key={guideline} value={guideline}>{guideline}</option>);

	const versionOptions = versionsValid
  	.map((version) => <option key={version} value={version}>{version}</option>);

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
          handleVersionChange={handleVersionChange}
          guidelineOptions={guidelineOptions}
          interrogate={interrogate}
          versionOptions={versionOptions}
        />
      </div>
      <div className="modal-header">
        <h4 className="control-counter">Controls ({interrogate.controlList.length})</h4>
        <h4 className="control-counter-tagged" onDoubleClick={() => {navigator.clipboard.writeText('http://dmblack.github.io/ism-interrogator/?controls=' + interrogate.controlsTagged.join(','))}} onClick={() => {navigator.clipboard.writeText('http://dmblack.github.io/ism-interrogator/?tagged=' + interrogate.controlsTagged.join(','))}}>{interrogate.controlsTagged.length > 0 && 'Tagged (' + interrogate.controlsTagged.length + ')'}</h4>
      </div>
      <ISM version='' interrogate={interrogate} setInterrogate={setInterrogate}></ISM>
    </div>
  );
}
export default App;
