import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../PrimaryButton';
import { useGameContext } from '../../contexts/GameContext';
import { useMahjongSettingsContext } from '../../contexts/MahjongSettingsContext';

function MahjongSettingsPlayers() {
  const { gameType, title, players, setPlayers, currDealer, setCurrDealer } = useGameContext();
  const { 
    startingPlayerScore,
    setStartingPlayerScore,
    limitValue,
    setLimitValue,
    baseWinScore,
    setBaseWinScore,
    reignOfTerror,
    setReignOfTerror } = useMahjongSettingsContext();
     
  const navigate = useNavigate();

  const handleStartingScoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const startingScore = Number(e.target.value);
    setStartingPlayerScore(startingScore);
  };

  const handleLimitValueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLimitValue = Number(e.target.value);
    setLimitValue(selectedLimitValue);
  };

  const handleBaseWinScoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBaseWinScore = Number(e.target.value);
    setBaseWinScore(selectedBaseWinScore);
  };
  const handleReignOfTerrorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedReignOfTerror = Number(e.target.value);
    setReignOfTerror(selectedReignOfTerror);
  };

  const handleStartClick = () => {
    navigate('/mahjong-scoresheet');
  };

   return (
    <div className="App">
      <header className="App-header">
        <div 
          style={{
            position: 'absolute', 
            top: '50%', left: '50%', 
            msTransform: 'translate(-50%, -50%)', 
            transform: 'translate(-50%, -50%)' }}>
          <div style={{ marginBottom: '20px' }}>
            <label>
              <h2 className='pageTitle'>
                {gameType} Settings ({title})
              </h2>
            </label>
          </div>
          <div style={{ marginTop: '20px'}}>
            <label>
                <span style={{ fontFamily: 'Segoe UI Emoji', fontSize: '30px', display: 'block'}}>&#x1F001;</span>
                <span style={{ fontSize: '1em', display: 'block' }}>SOUTH</span>
                <input 
                  style={{ width: '50px', fontSize: '1em' }}
                  name="southNameInput"
                  defaultValue={players[3] || 'P4'}
                  onChange={e => setPlayers([players[0], players[1], players[2], e.target.value])}
                  onClick={e => e.currentTarget.select()} />
            </label>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: '32px',
              marginTop: '20px'
            }}>
            <label style={{ display: 'flex', marginRight: '120px', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Segoe UI Emoji', fontSize: '30px' }}>&#x1F002;</span>
              <span style={{ fontSize: '1em' }}>WEST</span>
              <input
                style={{ width: '50px', fontSize: '1em' }}
                name="westNameInput"
                defaultValue={players[2] || 'P3'}
                onChange={e => setPlayers([players[0], players[1], e.target.value, ...players.slice(3)])}
                onClick={e => e.currentTarget.select()}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Segoe UI Emoji', fontSize: '30px' }}>&#x1F000;</span>
              <span style={{ fontSize: '1em' }}>EAST</span>
              <input
                style={{ width: '50px', fontSize: '1em' }}
                name="eastNameInput"
                defaultValue={players[0] || 'P1'}
                onChange={e => setPlayers([e.target.value, ...players.slice(1)])}
                onClick={e => e.currentTarget.select()}
              />
            </label>
          </div>
          <div style={{ marginTop: '20px'}}>
            <label>
                <span style={{ fontFamily: 'Segoe UI Emoji', fontSize: '30px', display: 'block'}}>&#x1F003;</span>
                <span style={{ fontSize: '1em', display: 'block' }}>NORTH</span>
                <input 
                  style={{ width: '50px', fontSize: '1em' }}
                  name="northNameInput"
                  defaultValue={players[1] || 'P2'}
                  onChange={e => setPlayers([players[0], e.target.value, ...players.slice(2)])}
                  onClick={e => e.currentTarget.select()} />
            </label>
          </div>
          <div style={{ marginTop: '20px'}}>
            <label>
              <select 
                className='dropdown-select'
                value={startingPlayerScore}
                title='Starting score for each player'
                onChange={handleStartingScoreChange}>
                <option value="2000">2000</option>
                <option value="3000">3000</option>
              </select>
                <span style={{ fontSize: '1em' }}>STARTING SCORE</span>
                <span style={{ fontSize: '0.8em', marginLeft: '8px', color: '#888' }}>
                  (for each player)
                </span>
            </label>
          </div>
          <div style={{ marginTop: '20px'}}>
            <label>
              <select 
                className='dropdown-select'
                value={limitValue}
                title='Limit value for a winning hand'
                onChange={handleLimitValueChange}>
                <option value="500">500</option>
                <option value="1000">1000</option>
                <option value="2000">2000</option>
                <option value="0">NO LIMIT</option>
              </select>
                <span style={{ fontSize: '1em' }}>LIMIT VALUE</span>
                <span style={{ fontSize: '0.8em', marginLeft: '8px', color: '#888' }}>
                  (for a winning hand)
                </span>
            </label>
          </div>
          <div style={{ marginTop: '20px'}}>
            <label>
              <select 
                className='dropdown-select'
                value={baseWinScore}
                title='Base score for a winning hand'
                onChange={handleBaseWinScoreChange}>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
                <span style={{ fontSize: '1em' }}>BASE SCORE</span>
                <span style={{ fontSize: '0.8em', marginLeft: '8px', color: '#888' }}>
                  (for a winning hand)
                </span>
            </label>
          </div>
          <div style={{ marginTop: '20px'}}>
            <label>
              <select 
                className='dropdown-select'
                value={reignOfTerror}
                title='Reign of Terror (Consecutive wins. this is a limit hand)'
                onChange={handleReignOfTerrorChange}>
                <option value="0">OFF</option>
                <option value="6">6 WINS IN A ROW</option>
                <option value="8">8 WINS IN A ROW</option>
              </select>
                <span style={{ fontSize: '1em' }}>REIGN OF TERROR</span>
                <span style={{ fontSize: '0.8em', marginLeft: '8px', color: '#888' }}>
                  (Consecutive wins for a limit hand)
                </span>
            </label>
          </div>
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <PrimaryButton onClick={handleStartClick}>
              Start Game
            </PrimaryButton>
          </div>
        </div>
      </header>
    </div>
  );
}

export default MahjongSettingsPlayers;