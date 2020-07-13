import React, { useState } from 'react';
import './App.css';
import ISMControl from './ISMControl.js';
import ISMRaw from './ISM.json';
import 'bootstrap/dist/css/bootstrap.css';

const App = () => {
  const [ filter, setFilter ] = useState(
    ''
  );
  
  const ISM = Object.entries(ISMRaw.ISM.Control);
  const ISMControls = ISM
    .filter((control) => control[1].Description.includes(filter))
    .map((control) => <ISMControl key={control[1].Identifier} control={control[1]} />);

  const handleChange = e => setFilter(e.target.value);

  return (
    <div className="App">
        <input
          value={filter}
          type="text"
          onChange={handleChange}
        />
	  <div className="row">

      {ISMControls}
	  </div>
    </div>
  );
}
export default App;
