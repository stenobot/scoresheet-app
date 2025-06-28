import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Start from './components/Start';
import ProgScoresheet from './components/ProgressiveRook/ProgScoresheet';
import ProgSettings from './components/ProgressiveRook/ProgSettings';
import MahjongSettingsPlayers from './components/Mahjong/MahjongSettingsPlayers';
import GameContextProvider from './contexts/GameContext';
import ProgSettingsContextProvider from './contexts/ProgSettingsContext';
import MahjongSettingsContextProvider from './contexts/MahjongSettingsContext';
import MahjongScoresheet from './components/Mahjong/MahjongScoresheet';
import LoadGames from './components/LoadGames';
import BasicSettingsContextProvider from './contexts/BasicSettingsContext';
import BasicSettings from './components/Basic/BasicSettings';
import BasicScoresheet from './components/Basic/BasicScoresheet';

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
                <ProgSettingsContextProvider>
                  <ProgSettings />
                </ProgSettingsContextProvider>
              </GameContextProvider>
            } />
        <Route 
          path="/prog-scoresheet" 
          element={
              <GameContextProvider>
                <ProgSettingsContextProvider>
                  <ProgScoresheet />
                </ProgSettingsContextProvider>
              </GameContextProvider>
            } />
        <Route
          path="/mahjong-settings-players"
          element={
            <GameContextProvider>
              <MahjongSettingsContextProvider>
                <MahjongSettingsPlayers />
              </MahjongSettingsContextProvider>
            </GameContextProvider>
          } />
        <Route 
          path="/mahjong-scoresheet" 
          element={
              <GameContextProvider>
                <MahjongSettingsContextProvider>
                  <MahjongScoresheet />
                </MahjongSettingsContextProvider>
              </GameContextProvider>
            } />
        <Route
          path="/basic-settings"
          element={
            <GameContextProvider>
              <BasicSettingsContextProvider>
                <BasicSettings />
              </BasicSettingsContextProvider>
            </GameContextProvider>
          } />
        <Route
          path="/basic-scoresheet"
          element={
            <GameContextProvider>
              <BasicSettingsContextProvider>
                <BasicScoresheet />
              </BasicSettingsContextProvider>
            </GameContextProvider>
          } />
        <Route path="/load-games" 
          element={
            <GameContextProvider>
              <LoadGames />
            </GameContextProvider>  
          } />
      </Routes>
    </Router>
  );
}

export default App;
