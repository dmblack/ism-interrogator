import React, { useState } from 'react';
import './App.css';
import ISMControl from './ISMControl.js';
import ISMRaw from './ISM.json';

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
      <header>
        <input
          value={filter}
          type="text"
          onChange={handleChange}
        />
      </header>
      {ISMControls}
    </div>
  );
}
export default App;
