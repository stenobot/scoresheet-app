import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../PrimaryButton';
import { useGameContext } from '../../contexts/GameContext';
import { useMahjongSettingsContext } from '../../contexts/MahjongSettingsContext';

function MahjongSettingsPlayers() {
const { currentGame, setCurrentGame, addGame } = useGameContext();
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
    <div className="container">
      <h1 className="title">{currentGame.gameType} Settings ({currentGame.title})</h1>
      <div>
        <label>
            <span className='mahjong-tile'>&#x1F001;</span>
            <span className='mahjong-tile-name'>SOUTH</span>
            <input 
              className='mahjong-tile-input'
              name="southNameInput"
              defaultValue={currentGame.players[3] || 'P4'}
              onChange={e => setCurrentGame({
                ...currentGame,
                players: [currentGame.players[0], currentGame.players[1], currentGame.players[2], e.target.value]
              })}
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
          <span className='mahjong-tile'>&#x1F002;</span>
          <span className='mahjong-tile-name'>WEST</span>
          <input
            className='mahjong-tile-input'
            name="westNameInput"
            defaultValue={currentGame.players[2] || 'P3'}
            onChange={e => setCurrentGame({
              ...currentGame,
              players: [currentGame.players[0], currentGame.players[1], e.target.value, ...currentGame.players.slice(3)]
            })}
            onClick={e => e.currentTarget.select()}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className='mahjong-tile'>&#x1F000;</span>
          <span className='mahjong-tile-name'>EAST</span>
          <input
            className='mahjong-tile-input'
            name="eastNameInput"
            defaultValue={currentGame.players[0] || 'P1'}
            onChange={e => setCurrentGame({
              ...currentGame,
              players: [e.target.value, ...currentGame.players.slice(1)]
            })}
            onClick={e => e.currentTarget.select()}
          />
        </label>
      </div>

      <div style={{ marginTop: '20px'}}>
        <label>
            <span className='mahjong-tile'>&#x1F003;</span>
            <span className='mahjong-tile-name'>NORTH</span>
            <input 
              className='mahjong-tile-input'
              name="northNameInput"
              defaultValue={currentGame.players[1] || 'P2'}
              onChange={e => setCurrentGame({
                ...currentGame,
                players: [currentGame.players[0], e.target.value, ...currentGame.players.slice(2)]
              })}
              onClick={e => e.currentTarget.select()} />
        </label>
      </div>

      <div className="settings-group">
          <div className="setting-row">
              <div className="setting-label">
                  STARTING SCORE
                  <span className="setting-description">(for each player)</span>
              </div>
              <div className="setting-control">
                <select className='setting-dropdown'            
                  value={startingPlayerScore}
                  title='Starting score for each player'
                  onChange={handleStartingScoreChange}>
                  <option value="2000">2000</option>
                  <option value="3000">3000</option>
                </select>
              </div>
          </div>

          <div className="setting-row">
              <div className="setting-label">
                  LIMIT VALUE
                  <span className="setting-description">(for a winning hand)</span>
              </div>
              <div className="setting-control">
                <select className='setting-dropdown'
                  value={limitValue}
                  title='Limit value for a winning hand'
                  onChange={handleLimitValueChange}>
                  <option value="500">500</option>
                  <option value="1000">1000</option>
                  <option value="2000">2000</option>
                  <option value="0">NO LIMIT</option>
                </select>
              </div>
          </div>

          <div className="setting-row">
              <div className="setting-label">
                  BASE SCORE
                  <span className="setting-description">(for a winning hand)</span>
              </div>
              <div className="setting-control">
                <select className='setting-dropdown'
                  value={baseWinScore}
                  title='Base score for a winning hand'
                  onChange={handleBaseWinScoreChange}>
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>
              </div>
          </div>

          <div className="setting-row">
              <div className="setting-label">
                  REIGN OF TERROR
                  <span className="setting-description">(Consecutive wins)</span>
              </div>
              <div className="setting-control">
                <select className='setting-dropdown'
                  value={reignOfTerror}
                  title='Reign of Terror (Consecutive wins. this is a limit hand)'
                  onChange={handleReignOfTerrorChange}>
                  <option value="0">OFF</option>
                  <option value="6">6 WINS IN A ROW</option>
                  <option value="8">8 WINS IN A ROW</option>
                </select>
              </div>
          </div>
      </div>

      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <PrimaryButton onClick={handleStartClick}>
          Start Game
        </PrimaryButton>
      </div>
    </div>
  );
}

export default MahjongSettingsPlayers;