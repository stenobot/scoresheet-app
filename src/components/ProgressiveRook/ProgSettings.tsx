import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../PrimaryButton';
import { useGameContext } from '../../contexts/GameContext';
import { useProgSettingsContext } from '../../contexts/ProgSettingsContext';
import React, { useState } from 'react';

function ProgSettings() {
  const { currentGame, setCurrentGame } = useGameContext();
  const { 
    showRowNums, 
    setShowRowNums, 
    startingRowNum, 
    showColTotals, 
    setShowColTotals,
    showGameTitle,
    setShowGameTitle,
    showRoundDescription,
    setShowRoundDescription,
    showRowLabels,
    setShowRowLabels } = useProgSettingsContext();

  const navigate = useNavigate();

  // Collapsible and checkbox state
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const handlePlayersChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPlayers = Number(e.target.value);
    const playersArray = Array.from({ length: selectedPlayers }, (_, i) => `P${i + 1}`);
    const scoresArray: number[][] = Array.from({ length: selectedPlayers }, () => []);
    
    setCurrentGame({
      ...currentGame,
      players: playersArray,
      scores: scoresArray
    });
  };
  const handleStartClick = () => {
    // Create prog-specific settings object to store in game object
    const progSettings = {
      showRowNums,
      startingRowNum,
      showColTotals,
      showGameTitle,
      showRoundDescription,
      showRowLabels
    };

    // Set current game with settings and first player as dealer
    setCurrentGame({
      ...currentGame,
      settings: JSON.stringify(progSettings),
      currDealer: currentGame.players[0]
    });
    
    console.log(`handleStartClick - settings saved: ${JSON.stringify(progSettings)}`);
    navigate('/prog-scoresheet');
  };

  const handleHomeClick = () => {
    navigate('/');
  }

  return (
    <div className='container'>
      <h1 className="title">{currentGame.gameType} Settings ({currentGame.title})</h1>
      <div className="settings-group">
        <div className="setting-row">
          <div className="setting-label">
            NUMBER OF PLAYERS
          </div>
          <div className="setting-control">
            <select 
              className='setting-dropdown'
              value={currentGame.players.length}
              onChange={handlePlayersChanged}>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>

        <div className="setting-row">
          <div className="setting-label">
            PLAYER NAMES
          </div>
          <div className="setting-control">
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {currentGame.players.map((player, index) => (
                <input
                  key={index}
                  type="text"
                  className="setting-input"
                  value={player}
                  onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                    e.currentTarget.select();
                  }}
                  onChange={(e) => {
                    const newPlayers = [...currentGame.players];
                    newPlayers[index] = e.target.value;
                    setCurrentGame({
                      ...currentGame,
                      players: newPlayers
                    });
                  }}
                  placeholder={`P${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Collapsible Advanced Settings Row */}
        <div className="setting-row">
          <div className="setting-label">
            <button
              type="button"
              className="setting-label-collapsible"
              style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, fontWeight: 'bold' }}
              onClick={() => setShowAdvancedSettings((prev) => !prev)}
              aria-expanded={showAdvancedSettings}
              aria-controls="test-settings-content"
            >
              {showAdvancedSettings ? '▼' : '►'} ADVANCED SETTINGS
            </button>
          </div>
          <div className="setting-control" style={{ width: '100%' }}>
            {showAdvancedSettings && (
              <div id="test-settings-content" style={{ marginTop: 10, paddingLeft: 10 }}>
                <p className='setting-small-header'>SHOW/HIDE IN ROWS:</p>
                <label style={{ display: 'block', marginBottom: 8 }}>
                  <input 
                    className='setting-checkbox' 
                    type='checkbox' 
                    checked={showRowNums}
                    onChange={() => setShowRowNums(!showRowNums)} 
                    style={{ marginRight: 8 }}
                  />
                  <span className="setting-label" style={{ marginLeft: 8 }}>
                    ROUND NUMBERS
                  </span>
                </label>
                <label style={{ display: 'block', marginBottom: 8 }}>
                  <input
                    className='setting-checkbox' 
                    type='checkbox' 
                    checked={showRowLabels}
                    onChange={() => setShowRowLabels(!showRowLabels)}
                    style={{ marginRight: 8 }}
                  />
                  <span className="setting-label" style={{ marginLeft: 8 }}>
                    ROUND LABELS
                  </span>
                </label>
                <p className='setting-small-header'>SHOW/HIDE IN COLUMNS:</p>
                <label style={{ display: 'block', marginBottom: 8 }}>
                  <input
                    className='setting-checkbox' 
                    type='checkbox' 
                    checked={showColTotals}
                    onChange={() => setShowColTotals(!showColTotals)}
                    style={{ marginRight: 8 }}
                  />
                  <span className="setting-label" style={{ marginLeft: 8 }}>
                    SCORE TOTALS
                  </span>
                </label>
                <p className='setting-small-header'>SHOW/HIDE IN HEADER:</p>
                <label style={{ display: 'block', marginBottom: 8 }}>
                  <input
                    className='setting-checkbox' 
                    type='checkbox' 
                    checked={showGameTitle}
                    onChange={() => setShowGameTitle(!showGameTitle)}
                    style={{ marginRight: 8 }}
                  />
                  <span className="setting-label" style={{ marginLeft: 8 }}>
                    GAME TITLE
                  </span>
                </label>
                <label style={{ display: 'block', marginBottom: 8 }}>
                  <input
                    className='setting-checkbox' 
                    type='checkbox' 
                    checked={showRoundDescription}
                    onChange={() => setShowRoundDescription(!showRoundDescription)}
                    style={{ marginRight: 8 }}
                  />
                  <span className="setting-label" style={{ marginLeft: 8 }}>
                    ROUND DESCRIPTION
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <PrimaryButton onClick={handleStartClick}>
          Start Game
        </PrimaryButton>
      </div>

      <label>
        <div style={{marginTop: 10}}>
          <a className='link' onClick={handleHomeClick}>Home</a>
        </div>
      </label>
    </div>
  );
}

export default ProgSettings;