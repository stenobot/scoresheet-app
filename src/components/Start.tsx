import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from './PrimaryButton';
import { useGameContext, gameTypes, GameType, Game } from '../contexts/GameContext';
import { generateId } from '../utils/Utils';
import { version } from '../../package.json';

function Start() {
  const navigate = useNavigate();
  const { setCurrentGame, games } = useGameContext();

  const [newGame, setNewGame] = useState<Game>({
    id: generateId(),
    title: 'My Game',
    gameType: GameType.ProgressiveRook,
    currRound: 1,
    players: ['P1', 'P2', 'P3', 'P4'],
    scores: [
      [0],
      [0],
      [0],
      [0],
    ],
    currDealer: 'P1',
    currLeader: 'P1',
    isGameOver: false,
    settings: ''
  });

  const gameDescriptions: Record<GameType, string> = {
    [GameType.ProgressiveRook]: 'Progressive Rook is a trick-taking game played with a 57-card Rook deck where the number of cards dealt increases each round.',
    [GameType.Mahjong]: 'Mahjong is a classic 4-player tile game with many rule variations.',
    [GameType.Loony]: 'Loony is a trick-taking game where players must bid how many tricks they will take each round, then use their same bids on the way back down. Similar to Up and Down the River aka Oh Hell, but played with a 57-card Rook deck rather than a standard 52-card deck.',
    [GameType.Basic]: 'A generic template that should work for most simple games.',
  };

  const isGameLoadData = games && games.length > 0;

  const handleNewClick = () => {
    setCurrentGame(newGame);

    switch (newGame.gameType) {
      case GameType.Basic: // Basic Scoresheet
        navigate('/basic-settings');
        break;
      case GameType.ProgressiveRook: // Progressive Rook
        navigate('/prog-settings');
        break;
      case GameType.Mahjong: // Mahjong
        navigate('/mahjong-settings-players');
        break;
      case GameType.Loony:
        navigate('/loony-settings');
        break;
    }
  }

  const handleLoadClick = () => {
    navigate('/load-games');
  }

  return (
    <div className='container' style={{ maxWidth: '480px', margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src="/images/logo-large.svg" alt="ScoreKeep" style={{ width: '200px' }} />
        <span style={{ fontSize: '14px', opacity: 0.6, fontFamily: "'m5x7', monospace", marginBottom: '12px' }}>v{version}</span>
      </div>
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
            style={{ fontSize: '34px', padding: '16px 4px', lineHeight: '1', paddingLeft: '10px' }}
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
        <p style={{ margin: 0, fontSize: '18px', opacity: 0.7 }}>
          {gameDescriptions[newGame.gameType]}
          {newGame.gameType === GameType.ProgressiveRook && (
            <> <button className='link' style={{ fontSize: '18px', fontFamily: 'inherit', fontWeight: 'bold' }} onClick={() => navigate('/prog-rules')}>See rules</button></>
          )}
          {newGame.gameType === GameType.Mahjong && (
            <> <button className='link' style={{ fontSize: '18px', fontFamily: 'inherit', fontWeight: 'bold' }} onClick={() => navigate('/mahjong-rules')}>See rules</button></>
          )}
          {newGame.gameType === GameType.Loony && (
            <> <button className='link' style={{ fontSize: '18px', fontFamily: 'inherit', fontWeight: 'bold' }} onClick={() => navigate('/loony-rules')}>See rules</button></>
          )}
        </p>
      </div>
      <label>
        <div>
          <PrimaryButton onClick={handleNewClick}>
            New Game
          </PrimaryButton>
        </div>
      </label>
      {isGameLoadData &&
        <label>
          <div>
            <PrimaryButton onClick={handleLoadClick}>
              Load Game
            </PrimaryButton>
          </div>
        </label>
      }
    </div>
  );
}

export default Start;