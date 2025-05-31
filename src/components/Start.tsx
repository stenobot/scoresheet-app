import { useNavigate } from 'react-router-dom';
import PrimaryButton from './PrimaryButton';
import { useGameContext, gameTypes } from '../contexts/GameContext';

function Start() {
  const navigate = useNavigate();
  const  { title, setTitle, gameType, setGameType } = useGameContext();
  const handleNewClick = () => {
    navigate('/settings');
  } 

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <label>
            <select 
              className='dropdown-select-game-type'
              defaultValue={gameTypes[1]}
              onChange={e => setGameType(e.target.value as unknown as typeof gameType)}>
                {gameTypes.map((i) => (
                  <option key={i}>
                    {i}
                  </option>
                ))}
            </select>
          </label>
          <label>
            <div style={{ marginTop: '25px'}}>
              <PrimaryButton onClick={handleNewClick}>
                New Game
              </PrimaryButton>
            </div>
          </label>
        </div>
      </header>
    </div>
  );
}

export default Start;