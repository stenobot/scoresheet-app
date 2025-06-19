import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from './PrimaryButton';
import { useGameContext, gameTypes, GameType, Game } from '../contexts/GameContext';
import { generateId } from '../utils/Utils';

function Start() {
  const navigate = useNavigate();
  const { addGame } = useGameContext();

  const [newGame, setNewGame] = useState<Game>({
    id: generateId(),
    title: 'New Game',
    gameType: GameType.ProgressiveRook,
    currRound: 1,
    players: ['P1', 'P2', 'P3', 'P4'],
    currDealer: 'P1',
    settings: ''
  });

  const handleNewClick = () => {
    addGame(newGame);

    switch (newGame.gameType) {
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
            defaultValue={newGame.title}
            onClick={e => e.currentTarget.select()}
            onChange={e => setNewGame({
              ...newGame,
              title: e.target.value
            })} />
        </label>
        <label>
          <select 
            className='setting-dropdown'
            value={newGame.gameType}
            onChange={e => setNewGame({
              ...newGame,
              gameType: e.target.value as unknown as typeof newGame.gameType
            })}>
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