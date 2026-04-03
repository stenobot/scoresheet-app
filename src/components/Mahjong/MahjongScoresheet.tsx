import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../PrimaryButton';
import { useGameContext } from '../../contexts/GameContext';
import { useMahjongSettingsContext } from '../../contexts/MahjongSettingsContext';
import MahjongEnterScores from './MahjongEnterScores';
import {
  MahjongGameSettings,
  MahjongRoundRecord,
  advanceDealer,
  isGameOver,
  getPlayerWind
} from '../../utils/MahjongUtils';

function MahjongScoresheet() {
  const { currentGame, updateGame } = useGameContext();
  const { setStartingPlayerScore, setLimitValue, setBaseWinScore, setReignOfTerror } = useMahjongSettingsContext();
  const navigate = useNavigate();

  const [parsedSettings, setParsedSettings] = useState<MahjongGameSettings | null>(null);
  const [showEnterScores, setShowEnterScores] = useState(false);

  // Parse game.settings and hydrate context whenever it changes
  useEffect(() => {
    if (currentGame.settings) {
      try {
        const s: MahjongGameSettings = JSON.parse(currentGame.settings);
        setParsedSettings(s);
        setStartingPlayerScore(s.startingPlayerScore);
        setLimitValue(s.limitValue);
        setBaseWinScore(s.baseWinScore);
        setReignOfTerror(s.reignOfTerrorLimit);
      } catch (e) {
        console.error('Failed to parse Mahjong settings', e);
      }
    }
  }, [currentGame.settings]); // eslint-disable-line react-hooks/exhaustive-deps

  // Running totals per player
  const totals = useMemo(() => {
    if (!parsedSettings) return Array(currentGame.players.length).fill(0);
    return currentGame.scores.map((playerScores) =>
      parsedSettings.startingPlayerScore +
      playerScores.reduce((sum: number, d) => sum + (Number(d) || 0), 0)
    );
  }, [currentGame.scores, parsedSettings, currentGame.players.length]);

  const handleConfirmRound = (record: MahjongRoundRecord) => {
    if (!parsedSettings) return;

    // Append deltas to scores array
    const newScores = currentGame.scores.map((playerScores, i) => [
      ...playerScores,
      record.scoreDeltas[i]
    ]);

    // Advance dealer state
    const nextRound = currentGame.currRound + 1;
    const dealerState = advanceDealer(parsedSettings, record.winnerIndex, record.isReignOfTerror, nextRound);

    // Check game over
    const gameOver = isGameOver(nextRound, dealerState.timesDealerWon);

    // Compute current leader (highest total)
    const newTotals = newScores.map(playerScores =>
      parsedSettings.startingPlayerScore + playerScores.reduce((sum: number, d) => sum + (Number(d) || 0), 0)
    );
    const maxTotal = Math.max(...newTotals);
    const leaderIndex = newTotals.indexOf(maxTotal);

    const newSettings: MahjongGameSettings = {
      ...parsedSettings,
      ...dealerState,
      roundHistory: [...parsedSettings.roundHistory, record]
    };

    updateGame({
      ...currentGame,
      currRound: nextRound,
      scores: newScores,
      currDealer: currentGame.players[dealerState.dealerIndex],
      currLeader: currentGame.players[leaderIndex],
      isGameOver: gameOver,
      settings: JSON.stringify(newSettings)
    });

    setShowEnterScores(false);
  };

  if (!parsedSettings) {
    return (
      <div className="container">
        <p className="table-subtitle">Loading...</p>
      </div>
    );
  }

  const dealerIndex = parsedSettings.dealerIndex;

  return (
    <div className="container">
      <table
        className="table-with-row-nums"
        style={{ fontFamily: "'m5x7', monospace", fontSize: '22px' }}>
        <caption>
          <h2 className="table-title">{currentGame.title}</h2>
          <h6 className="table-subtitle">
            {currentGame.isGameOver ? (
              `${currentGame.currLeader} wins!`
            ) : (
              <>
                Round {currentGame.currRound} · {parsedSettings.prevailingWind} Wind · Dealer: {currentGame.currDealer}
                {parsedSettings.consecutiveWins > 0 && ` · ${parsedSettings.consecutiveWins} in a row`}
              </>
            )}
          </h6>
        </caption>

        <thead>
          <tr>
            <th className="num-label-cell-header"></th>
            {currentGame.players.map((player, i) => (
              <th
                key={i}
                className={`normal-cell-header${dealerIndex === i ? ' dealer-column-highlight' : ''}`}>
                <span style={{ fontSize: '28px' }}>{player}</span>
                <span style={{ fontSize: '18px', display: 'block', color: '#a0aec0' }}>
                  {getPlayerWind(i, dealerIndex)}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {parsedSettings.roundHistory.map((record, rowIndex) => (
            <tr key={rowIndex}>
              <td className="num-label-cell">{record.roundNumber}</td>
              {record.scoreDeltas.map((delta, playerIndex) => (
                <td
                  key={playerIndex}
                  className={`normal-cell${record.dealerIndex === playerIndex ? ' dealer-column-highlight' : ''}`}
                  style={{ textAlign: 'center', padding: '4px 8px' }}>
                  <span className={delta > 0 ? 'score-positive' : delta < 0 ? 'score-negative' : 'score-zero'}>
                    {delta > 0 ? `+${delta}` : delta === 0 ? '—' : delta}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr>
            <th className="num-label-cell-header"></th>
            {totals.map((total, i) => (
              <th key={i} className="normal-cell-footer">{total}</th>
            ))}
          </tr>
        </tfoot>
      </table>

      <div style={{ marginTop: '0.7em' }}>
        {currentGame.isGameOver ? (
          <div className="table-subtitle">The game has ended</div>
        ) : (
          <PrimaryButton onClick={() => setShowEnterScores(true)}>
            Score Round {currentGame.currRound}
          </PrimaryButton>
        )}
        <div style={{ marginTop: 10 }}>
          <button className="link" onClick={() => navigate('/')}>Home</button>
        </div>
      </div>

      {showEnterScores && (
        <MahjongEnterScores
          players={currentGame.players}
          settings={parsedSettings}
          onConfirm={handleConfirmRound}
          onCancel={() => setShowEnterScores(false)}
        />
      )}
    </div>
  );
}

export default MahjongScoresheet;
