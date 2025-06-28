import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../PrimaryButton';
import { gameTypes, useGameContext } from '../../contexts/GameContext';
import { useBasicSettingsContext } from '../../contexts/BasicSettingsContext';

function BasicSettings() {
  const { currentGame, setCurrentGame } = useGameContext();
  const { 
    showRowNums, 
    setShowRowNums, 
    startingRowNum, 
    setStartingRowNum, 
    showColTotals, 
    setShowColTotals } = useBasicSettingsContext();

  const navigate = useNavigate();

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
    // Create settings object
    const basicSettings = {
      showRowNums,
      startingRowNum,
      showColTotals
    };

    // Set current game with settings and first player as dealer
    setCurrentGame({
      ...currentGame,
      settings: JSON.stringify(basicSettings),
      currDealer: currentGame.players[0]
    });
    
    console.log(`handleStartClick - settings saved: ${JSON.stringify(basicSettings)}`);
    navigate('/basic-scoresheet');
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

        <div className="setting-row-fixed">
          <div className="setting-label">
            SHOW COLUMN TOTALS
          </div>
          <div>
           <input 
                className='setting-checkbox' 
                type='checkbox' 
                checked={showColTotals}
                onChange={e => setShowColTotals(e.target.checked)} />
          </div>
        </div>

         <div className="setting-row-fixed">
          <div className="setting-label">
            SHOW ROW NUMBERS
          </div>
          <div>
            <input 
              className='setting-checkbox' 
              type='checkbox' 
              checked={showRowNums}
              onChange={e => setShowRowNums(e.target.checked)} />
          </div>
        </div>
        { showRowNums && currentGame.gameType === gameTypes[1] &&
          <div className="setting-row">
            <div className="setting-label">
              STARTING ROW NUMBER
            </div>
            <div className="setting-control">
              <select 
                className='setting-dropdown' 
                value={startingRowNum}
                onChange={e => setStartingRowNum(Number(e.target.value))}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </div>
          </div>
        }
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

export default BasicSettings;