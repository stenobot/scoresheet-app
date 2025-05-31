import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Start from './components/Start';
import ProgScoresheet from './components/ProgressiveRook/ProgScoresheet';
import ProgSettings from './components/ProgressiveRook/ProgSettings';
import MahjongSettingsPlayers from './components/Mahjong/MahjongSettingsPlayers';
import GameContextProvider from './contexts/GameContext';
import ProgContextProvider from './contexts/ProgContext';

export enum Preset {
  None = 'none',
  ProgressiveRook = 'Progressive Rook',
  Mahjong = 'Mahjong (1960s)'
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
            <GameContextProvider>
              <Start />
            </GameContextProvider>  
          } />
        <Route 
          path="/prog-settings" 
          element={
              <GameContextProvider>      
                <ProgContextProvider>
                  <ProgSettings />
                </ProgContextProvider>
              </GameContextProvider>
            } />
        <Route 
          path="/prog-scoresheet" 
          element={
              <GameContextProvider>
                <ProgContextProvider>
                  <ProgScoresheet />
                </ProgContextProvider>
              </GameContextProvider>
            } />
        <Route
          path="/mahjong-settings-players"
          element={
            <GameContextProvider>
              <MahjongSettingsPlayers />
            </GameContextProvider>
          } />
      </Routes>
    </Router>
  );
}

export default App;
