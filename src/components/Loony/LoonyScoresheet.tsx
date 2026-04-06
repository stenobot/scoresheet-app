import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../../contexts/GameContext';

interface LoonyGameSettings {
  topRound: number;
  totalRounds: number;
  phase: 'bidding' | 'scoring';
  biddingPlayerIndex: number; // -1 when all bids are entered
  bids: (number | null)[][];  // [playerIndex][cardsDealt - 1]
  madeBids: (boolean | null)[][];  // [playerIndex][roundIndex]
  scores: (number | null)[][];     // [playerIndex][roundIndex] — running total after each round
}

function cardsDealtForRound(roundNum: number, topRound: number): number {
  return roundNum <= topRound ? roundNum : 2 * topRound - roundNum;
}

function LoonyScoresheet() {
  const { currentGame, updateGame } = useGameContext();
  const navigate = useNavigate();

  const [showBidModal, setShowBidModal] = useState(false);
  const [modalPlayerIndex, setModalPlayerIndex] = useState(0);
  const [modalBidValue, setModalBidValue] = useState(0);

  // Parse settings
  if (!currentGame.settings) {
    return (
      <div className='container'>
        <p style={{ fontFamily: "'m5x7', monospace", fontSize: '20px' }}>
          No game data.{' '}
          <button className='link' onClick={() => navigate('/')}>Home</button>
        </p>
      </div>
    );
  }

  let settings: LoonyGameSettings;
  try {
    settings = JSON.parse(currentGame.settings) as LoonyGameSettings;
  } catch {
    return (
      <div className='container'>
        <p style={{ fontFamily: "'m5x7', monospace", fontSize: '20px' }}>
          Invalid game data.{' '}
          <button className='link' onClick={() => navigate('/')}>Home</button>
        </p>
      </div>
    );
  }

  const {
    topRound, totalRounds, phase,
    biddingPlayerIndex, bids, madeBids, scores,
  } = settings;
  const { players, currRound } = currentGame;
  const numPlayers = players.length;
  const dealerIndex = (currRound - 1) % numPlayers;
  const roundIndex = currRound - 1;
  const cardsThisRound = cardsDealtForRound(currRound, topRound);
  const bidIndex = cardsThisRound - 1;
  const goingDown = currRound > topRound;
  const isLastRound = currRound === totalRounds;

  // Bidding order for any round: [dealerIndex+1, ..., dealerIndex]
  const biddingOrder: number[] = Array.from(
    { length: numPlayers },
    (_, i) => (dealerIndex + i + 1) % numPlayers
  );

  const saveSettings = (newSettings: LoonyGameSettings) => {
    updateGame({ ...currentGame, settings: JSON.stringify(newSettings) });
  };

  // Score before a given round (searches backwards for last saved total)
  const getPreviousScore = (playerIndex: number, rIndex: number): number => {
    for (let r = rIndex - 1; r >= 0; r--) {
      if (scores[playerIndex][r] !== null) return scores[playerIndex][r] as number;
    }
    return 0;
  };

  // Score after a given round, given made/not-made
  const computeRoundScore = (playerIndex: number, rIndex: number, made: boolean): number => {
    const rCards = cardsDealtForRound(rIndex + 1, topRound);
    const bid = bids[playerIndex][rCards - 1] ?? 0;
    const prev = getPreviousScore(playerIndex, rIndex);
    return made ? prev + 10 + bid : prev - bid;
  };

  // Valid bid options for a player; dealer has one value excluded
  const getBidOptions = (playerIndex: number): number[] => {
    const opts = Array.from({ length: cardsThisRound + 1 }, (_, i) => i);
    if (playerIndex === dealerIndex) {
      const otherSum = bids.reduce(
        (sum, pb, pi) => (pi === dealerIndex ? sum : sum + (pb[bidIndex] ?? 0)),
        0
      );
      const forbidden = cardsThisRound - otherSum;
      if (forbidden >= 0 && forbidden <= cardsThisRound) {
        return opts.filter(o => o !== forbidden);
      }
    }
    return opts;
  };

  // ── Cell click handler ──────────────────────────────────────────────────────

  const handleCellClick = (playerIndex: number, rIndex: number) => {
    if (rIndex + 1 !== currRound) return;

    if (!goingDown && phase === 'bidding') {
      if (playerIndex !== biddingPlayerIndex) return;
      const opts = getBidOptions(playerIndex);
      setModalPlayerIndex(playerIndex);
      setModalBidValue(opts[0]);
      setShowBidModal(true);
    } else {
      // Scoring phase: toggle made / not-made
      const rCards = cardsDealtForRound(rIndex + 1, topRound);
      if (bids[playerIndex][rCards - 1] === null) return; // no bid, ignore
      const newMadeBids = madeBids.map(row => [...row]);
      newMadeBids[playerIndex][roundIndex] =
        newMadeBids[playerIndex][roundIndex] !== true ? true : null;
      saveSettings({ ...settings, madeBids: newMadeBids });
    }
  };

  // ── Bid modal confirm ───────────────────────────────────────────────────────

  const handleBidConfirm = () => {
    const newBids = bids.map(row => [...row]);
    newBids[modalPlayerIndex][bidIndex] = modalBidValue;

    const currentIdx = biddingOrder.indexOf(modalPlayerIndex);
    const nextBiddingPlayerIndex =
      currentIdx < biddingOrder.length - 1 ? biddingOrder[currentIdx + 1] : -1;

    saveSettings({ ...settings, bids: newBids, biddingPlayerIndex: nextBiddingPlayerIndex });
    setShowBidModal(false);
  };

  // ── Phase transitions ───────────────────────────────────────────────────────

  const handleScoreRound = () => {
    saveSettings({ ...settings, phase: 'scoring' });
  };

  const handleNextRound = () => {
    // Commit scores for the current round (null madeBid = did not make)
    const newScores = scores.map(row => [...row]);
    for (let p = 0; p < numPlayers; p++) {
      const made = madeBids[p][roundIndex] === true;
      newScores[p][roundIndex] = computeRoundScore(p, roundIndex, made);
    }

    if (isLastRound) {
      const finalScores = newScores.map(ps => (ps[totalRounds - 1] as number) ?? 0);
      const maxScore = Math.max(...finalScores);
      const winnerIndex = finalScores.indexOf(maxScore);
      updateGame({
        ...currentGame,
        isGameOver: true,
        currLeader: players[winnerIndex],
        settings: JSON.stringify({ ...settings, scores: newScores, phase: 'scoring' }),
      });
      return;
    }

    const nextRound = currRound + 1;
    const nextGoingDown = nextRound > topRound;
    const nextDealerIndex = (nextRound - 1) % numPlayers;
    const nextFirstBidder = (nextDealerIndex + 1) % numPlayers;
    updateGame({
      ...currentGame,
      currRound: nextRound,
      settings: JSON.stringify({
        ...settings,
        scores: newScores,
        phase: nextGoingDown ? 'scoring' : 'bidding',
        biddingPlayerIndex: nextGoingDown ? -1 : nextFirstBidder,
      }),
    });
  };

  // ── Cell display helpers ────────────────────────────────────────────────────

  const getCellInfo = (
    playerIndex: number,
    rIndex: number
  ): { text: string; color?: string; clickable: boolean } => {
    const rNum = rIndex + 1;
    const rCards = cardsDealtForRound(rNum, topRound);
    const bid = bids[playerIndex][rCards - 1];
    const made = madeBids[playerIndex][rIndex];
    const savedScore = scores[playerIndex][rIndex];

    if (rNum > currRound) {
      return { text: '', clickable: false };
    }

    if (rNum < currRound) {
      if (bid === null) return { text: '', clickable: false };
      const scoreStr = savedScore !== null ? ` / ${savedScore}` : '';
      return {
        text: `${bid}${scoreStr}`,
        color: made === true ? '#68d391' : '#fc8181',
        clickable: false,
      };
    }

    // ── Current round ──
    if (!goingDown && phase === 'bidding') {
      if (bid !== null) {
        return { text: `${bid}`, color: '#a0aec0', clickable: false };
      }
      const isCurrentBidder = playerIndex === biddingPlayerIndex;
      return {
        text: isCurrentBidder ? 'bid' : '-',
        color: isCurrentBidder ? '#f6ad55' : '#4a5568',
        clickable: isCurrentBidder,
      };
    }

    // Scoring phase (up round after Score Round, or any down round)
    if (bid === null) return { text: '-', clickable: false };

    if (made === true) {
      const newScore = computeRoundScore(playerIndex, rIndex, true);
      return { text: `${bid} / ${newScore}`, color: '#68d391', clickable: true };
    }

    return { text: `${bid}`, clickable: true };
  };

  // Footer: shows live preview during scoring, last completed score during bidding
  const getFooterScore = (playerIndex: number): number => {
    if (currentGame.isGameOver) {
      for (let r = totalRounds - 1; r >= 0; r--) {
        if (scores[playerIndex][r] !== null) return scores[playerIndex][r] as number;
      }
      return 0;
    }
    if (phase === 'scoring' || goingDown) {
      const made = madeBids[playerIndex][roundIndex] === true;
      return computeRoundScore(playerIndex, roundIndex, made);
    }
    for (let r = roundIndex - 1; r >= 0; r--) {
      if (scores[playerIndex][r] !== null) return scores[playerIndex][r] as number;
    }
    return 0;
  };

  const allBidsDone = biddingPlayerIndex === -1;

  const totalBidsThisRound = bids.reduce((sum, pb) => sum + (pb[bidIndex] ?? 0), 0);
  const otherBidsSum = bids.reduce((sum, pb, pi) => pi === dealerIndex ? sum : sum + (pb[bidIndex] ?? 0), 0);
  const dealerForbiddenBid = (() => {
    const forbidden = cardsThisRound - otherBidsSum;
    return forbidden >= 0 && forbidden <= cardsThisRound ? forbidden : null;
  })();
  const subscriptionText =
    totalBidsThisRound > cardsThisRound ? 'This round is oversubscribed' :
    totalBidsThisRound < cardsThisRound ? 'This round is undersubscribed' :
    null;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className='container'>
      <h1 className="table-title">{currentGame.title}</h1>
      <p className="table-subtitle" style={{ marginBottom: '12px' }}>
        {currentGame.isGameOver
          ? `Game Over`
          : goingDown
          ? `Round ${currRound} · Going Down · ${cardsThisRound} card${cardsThisRound !== 1 ? 's' : ''}`
          : `Round ${currRound} · Going Up · ${cardsThisRound} card${cardsThisRound !== 1 ? 's' : ''}`}
      </p>

      <div style={{ overflowX: 'auto' }}>
        <table className="table-with-row-nums" style={{ width: '100%' }}>
          <thead>
            <tr>
              <td className="num-label-cell">#</td>
              {players.map((player, idx) => (
                <td key={idx} className="normal-cell-header" style={{ textAlign: 'center' }}>
                  {player}
                  {idx === dealerIndex && (
                    <div style={{
                      fontSize: '14px',
                      color: '#4395A7',
                      fontFamily: "'m5x7', monospace",
                      lineHeight: '1.2',
                    }}>
                      dealer
                    </div>
                  )}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: totalRounds }, (_, rIndex) => {
              const rNum = rIndex + 1;
              const rCards = cardsDealtForRound(rNum, topRound);
              const isCurrent = rNum === currRound;

              return (
                <tr key={rIndex} style={{ backgroundColor: isCurrent ? '#313c4e' : undefined }}>
                  <td className="num-label-cell">{rCards}</td>
                  {players.map((_, pIdx) => {
                    const { text, color, clickable } = getCellInfo(pIdx, rIndex);
                    const isWinner = currentGame.isGameOver && players[pIdx] === currentGame.currLeader;
                    return (
                      <td
                        key={pIdx}
                        className="normal-cell"
                        style={{
                          textAlign: 'center',
                          color: isWinner && rIndex === totalRounds - 1 ? '#68d391' : color,
                          cursor: clickable ? 'pointer' : 'default',
                          fontFamily: "'m5x7', monospace",
                          fontSize: '20px',
                          padding: '6px 8px',
                          opacity: rNum > currRound ? 0.25 : 1,
                          userSelect: 'none',
                          WebkitUserSelect: 'none',
                        }}
                        onClick={() => handleCellClick(pIdx, rIndex)}
                      >
                        {text}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td className="num-label-cell">Σ</td>
              {players.map((_, pIdx) => {
                const isWinner = currentGame.isGameOver && players[pIdx] === currentGame.currLeader;
                return (
                  <td
                    key={pIdx}
                    className="normal-cell-footer"
                    style={{
                      textAlign: 'center',
                      fontFamily: "'m5x7', monospace",
                      fontSize: '20px',
                      color: isWinner ? '#68d391' : undefined,
                      fontWeight: isWinner ? 'bold' : undefined,
                    }}>
                    {getFooterScore(pIdx)}
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ── Action area ── */}
      <div style={{ marginTop: '20px' }}>
        {!currentGame.isGameOver && (
          <>
            {/* Bidding phase (up rounds only) */}
            {!goingDown && phase === 'bidding' && (
              <>
                {biddingPlayerIndex >= 0 && (
                  <p style={{
                    fontFamily: "'m5x7', monospace",
                    fontSize: '20px',
                    color: '#a0aec0',
                    marginBottom: '12px',
                  }}>
                    Waiting for {players[biddingPlayerIndex]}'s bid
                  </p>
                )}
                {allBidsDone && subscriptionText && (
                  <p style={{
                    fontFamily: "'m5x7', monospace",
                    fontSize: '20px',
                    color: '#a0aec0',
                    marginBottom: '12px',
                  }}>
                    {subscriptionText}
                  </p>
                )}
                <button
                  className="primary-button"
                  style={{ width: '100%' }}
                  disabled={!allBidsDone}
                  onClick={handleScoreRound}>
                  Score Round {currRound}
                </button>
              </>
            )}

            {/* Scoring phase */}
            {(phase === 'scoring' || goingDown) && (
              <>
                {subscriptionText && (
                  <p style={{
                    fontFamily: "'m5x7', monospace",
                    fontSize: '20px',
                    color: '#a0aec0',
                    marginBottom: '12px',
                  }}>
                    {subscriptionText}
                  </p>
                )}
                <p style={{
                  fontFamily: "'m5x7', monospace",
                  fontSize: '22px',
                  color: '#e4e4e4',
                  marginBottom: '12px',
                }}>
                  Tap players who made their bid
                </p>
                <button
                  className="primary-button"
                  style={{ width: '100%' }}
                  onClick={handleNextRound}>
                  {isLastRound ? 'End Game' : 'Next Round'}
                </button>
              </>
            )}
          </>
        )}

        {/* Game over */}
        {currentGame.isGameOver && (
          <div style={{ marginTop: '10px' }}>
            <p style={{
              fontFamily: "'m5x7', monospace",
              fontSize: '30px',
              color: '#68d391',
              marginBottom: '8px',
            }}>
              {currentGame.currLeader} wins!
            </p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <button className='link' onClick={() => navigate('/')}>Home</button>
      </div>

      {/* ── Bid modal ── */}
      {showBidModal && (
        <div
          className="mahjong-modal-overlay"
          onClick={() => setShowBidModal(false)}>
          <div
            style={{
              background: '#2d3748',
              borderRadius: '12px',
              padding: '24px',
              width: '280px',
              margin: 'auto',
              marginTop: '80px',
            }}
            onClick={e => e.stopPropagation()}>
            <h2 style={{
              fontFamily: "'m5x7', monospace",
              fontSize: '26px',
              marginBottom: '8px',
              color: '#e4e4e4',
            }}>
              {players[modalPlayerIndex]}'s bid
            </h2>
            <p style={{
              fontFamily: "'m5x7', monospace",
              fontSize: '18px',
              color: '#a0aec0',
              marginBottom: '12px',
            }}>
              {cardsThisRound} card{cardsThisRound !== 1 ? 's' : ''} this round
            </p>
            {modalPlayerIndex === dealerIndex && dealerForbiddenBid !== null && (
              <p style={{
                fontFamily: "'m5x7', monospace",
                fontSize: '16px',
                color: '#f6ad55',
                marginBottom: '12px',
              }}>
                Cannot bid {dealerForbiddenBid}. Total bids cannot equal {cardsThisRound}.
              </p>
            )}
            <select
              className='setting-dropdown'
              style={{ width: '100%', marginBottom: '16px', fontSize: '32px', textAlign: 'center' }}
              value={modalBidValue}
              onChange={e => setModalBidValue(Number(e.target.value))}>
              {getBidOptions(modalPlayerIndex).map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <button
              className="primary-button"
              style={{ width: '100%', marginTop: '0' }}
              onClick={handleBidConfirm}>
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoonyScoresheet;
