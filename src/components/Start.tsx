import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from './PrimaryButton';
import { useGameContext, gameTypes } from '../contexts/GameContext';

function Start() {
  const navigate = useNavigate();
  const  { title, setTitle, gameType, setGameType } = useGameContext();

  useEffect(() => {
    //setGameType(gameTypes[1]); // Default to Progressive Rook
    //console.log(gameType + " selected as default game type");
  });

  const handleNewClick = () => {
    switch (gameType) {
      case gameTypes[0]: // Simple Scoresheet
      case gameTypes[1]: // Progressive Rook
        navigate('/prog-settings');
        break;
      case gameTypes[2]: // Mahjong
        navigate('/mahjong-settings-players');
        break;
    }
  }

  return (
    <div className='container'>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <label>
          <input
            className='input'
            defaultValue={title}
            onClick={e => e.currentTarget.select()}
            onChange={e => setTitle(e.target.value)} />
        </label>
        <label>
          <select 
            className='setting-dropdown'
            value={gameType}
            onChange={e => setGameType(e.target.value as unknown as typeof gameType)}>
              {gameTypes.map((i) => (
                <option key={i}>
                  {i}
                </option>
              ))}
          </select>
        </label>
      </div>
      <label>
        <div>
          <PrimaryButton onClick={handleNewClick}>
            New Game
          </PrimaryButton>
        </div>
      </label>
    </div>
  );
}

export default Start;