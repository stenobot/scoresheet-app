import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Scoresheet from './components/Scoresheet';
import Start from './components/Start';
import Settings from './components/Settings';
import GameContextProvider from './contexts/GameContext';

export enum Preset {
  None = 'none',
  ProgressiveRook = 'Progressive Rook',
  Mahjong = 'Mahjong (1960s)'
}

function App() {
  const [colNum, setColNum] = useState(2);
  const [showRowNums, setShowRowNums] = useState(false);
  const [startingRowNum, setStartingRowNum] = useState(1);
  const [showColTotals, setShowColTotals] = useState(false);
  const [presets] = useState([Preset.None, Preset.ProgressiveRook, Preset.Mahjong]);
  const [currPreset, setCurrPreset] = useState(Preset.None);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route 
          path="/settings" 
          element={
            <GameContextProvider>      
              <Settings 
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
              </GameContextProvider>
            } />
        <Route 
          path="/scoresheet" 
          element={
            <GameContextProvider>
              <Scoresheet 
                colNum={colNum}
                showRowNums={showRowNums}
                startingRowNum={startingRowNum}
                showColTotals={showColTotals}
                currPreset={currPreset} />
              </GameContextProvider>
            } />
      </Routes>
    </Router>
  );
}

export default App;
