import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../PrimaryButton';
import { useGameContext } from '../../contexts/GameContext';

function LoonySettings() {
  const { currentGame, setCurrentGame, updateGame } = useGameContext();
  const navigate = useNavigate();

  // Loony requires 5–10 players; normalize on mount if coming from Start with defaults
  useEffect(() => {
    if (currentGame.players.length < 5 || currentGame.players.length > 10) {
      const numPlayers = 5;
      setCurrentGame({
        ...currentGame,
        players: Array.from({ length: numPlayers }, (_, i) => `P${i + 1}`),
        scores: Array.from({ length: numPlayers }, () => []),
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlayersChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const numPlayers = Number(e.target.value);
    setCurrentGame({
      ...currentGame,
      players: Array.from({ length: numPlayers }, (_, i) => `P${i + 1}`),
      scores: Array.from({ length: numPlayers }, () => []),
    });
  };

  const handleStartClick = () => {
    const numPlayers = currentGame.players.length;
    const topRound = Math.floor(56 / numPlayers);
    const totalRounds = 2 * topRound - 1;

    const loonySettings = {
      topRound,
      totalRounds,
      phase: 'bidding' as const,
      biddingPlayerIndex: 1 % numPlayers, // round 1 dealer is player[0], so first bidder is player[1]
      bids: Array.from({ length: numPlayers }, () => Array(topRound).fill(null)),
      madeBids: Array.from({ length: numPlayers }, () => Array(totalRounds).fill(null)),
      scores: Array.from({ length: numPlayers }, () => Array(totalRounds).fill(null)),
    };

    updateGame({
      ...currentGame,
      currRound: 1,
      settings: JSON.stringify(loonySettings),
      currDealer: currentGame.players[0],
      currLeader: currentGame.players[0],
    });
    navigate('/loony-scoresheet');
  };

  const handleHomeClick = () => navigate('/');

  return (
    <div className='container'>
      <h1 className="title">{currentGame.gameType} Settings ({currentGame.title})</h1>
      <div className="settings-group">

        <div className="setting-row">
          <div className="setting-label">NUMBER OF PLAYERS</div>
          <div className="setting-control">
            <select
              className='setting-dropdown'
              value={currentGame.players.length}
              onChange={handlePlayersChanged}>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
        </div>

        <div className="setting-row">
          <div className="setting-label">PLAYER NAMES</div>
          <div className="setting-control">
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {currentGame.players.map((player, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="text"
                    className="setting-input"
                    value={player}
                    onClick={(e) => e.currentTarget.select()}
                    onChange={(e) => {
                      const newPlayers = [...currentGame.players];
                      newPlayers[index] = e.target.value;
                      setCurrentGame({ ...currentGame, players: newPlayers });
                    }}
                    placeholder={`P${index + 1}`}
                  />
                  {index === 0 && (
                    <span style={{ fontFamily: "'m5x7', monospace", fontSize: '16px', color: '#4395A7' }}>
                      Dealer
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <div style={{ marginBottom: '20px' }}>
        <PrimaryButton onClick={handleStartClick}>
          Start Game
        </PrimaryButton>
      </div>

      <label>
        <div style={{ marginTop: 10 }}>
          <button className='link' onClick={handleHomeClick}>Home</button>
        </div>
      </label>
    </div>
  );
}

export default LoonySettings;
