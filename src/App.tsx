import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Scoresheet from './components/Scoresheet';
import Start from './components/Start';
import Settings from './components/Settings';

export enum Preset {
  None = 'none',
  ProgressiveRook = 'Progressive Rook'
}

function App() {
  const [title, setTitle] = useState('Game 1'); 
  const [colNum, setColNum] = useState(2);
  const [showRowNums, setShowRowNums] = useState(false);
  const [startingRowNum, setStartingRowNum] = useState(1);
  const [showColTotals, setShowColTotals] = useState(false);
  const [presets] = useState([Preset.None, Preset.ProgressiveRook]);
  const [currPreset, setCurrPreset] = useState(Preset.None);

  return (
        <Router>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route 
          path="/settings" 
          element={
            <Settings 
              title={title}
              setTitle={setTitle} 
              colNum={colNum}
              setColNum={setColNum}
              showRowNums={showRowNums}
              setShowRowNums={setShowRowNums}
              startingRowNum={startingRowNum}
              setStartingRowNum={setStartingRowNum}
              showColTotals={showColTotals}
              setShowColTotals={setShowColTotals}
              presets={presets}
              setCurrPreset={setCurrPreset} />
            } />
        <Route 
          path="/scoresheet" 
          element={
            <Scoresheet 
              title={title} 
              colNum={colNum}
              showRowNums={showRowNums}
              startingRowNum={startingRowNum}
              showColTotals={showColTotals}
              currPreset={currPreset} />
            } />
      </Routes>
    </Router>
  );
}

export default App;
