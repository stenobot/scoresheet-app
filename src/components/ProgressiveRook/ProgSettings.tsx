import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PrimaryButton from '../PrimaryButton';
import { gameTypes, useGameContext } from '../../contexts/GameContext';
import { useProgSettingsContext } from '../../contexts/ProgSettingsContext';

function ProgSettings() {
  const { gameType, title, players, setPlayers, currDealer, setCurrDealer } = useGameContext();
  const { 
    showRowNums, 
    setShowRowNums, 
    startingRowNum, 
    setStartingRowNum, 
    showColTotals, 
    setShowColTotals } = useProgSettingsContext();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("url changed");
  }, [location]);

  const handlePlayersChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPlayers = Number(e.target.value);
    const playersArray = Array.from({ length: selectedPlayers }, (_, i) => `P${i + 1}`);
    setPlayers(playersArray);
  };

  const handleStartClick = () => {
    // Workaround to set starting row for Simple Scoresheet
    if (gameType === gameTypes[0]) {
      setStartingRowNum(1);
    }
    setCurrDealer(players[0]); // Set the first player as the current dealer
    console.log(`handleStartClick - players: ${players}, currDealer: ${currDealer}`);
    navigate('/prog-scoresheet');
  };

  return (
    <div className='container'>
      <h1 className="title">{gameType} Settings ({title})</h1>
      <div className="settings-group">
        <div className="setting-row">
          <div className="setting-label">
            NUMBER OF PLAYERS
          </div>
          <div className="setting-control">
            <select 
              className='setting-dropdown'
              value={players.length}
              onChange={handlePlayersChange}>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
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
        { showRowNums && gameType === gameTypes[1] &&
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
    </div>
  );
}

export default ProgSettings;