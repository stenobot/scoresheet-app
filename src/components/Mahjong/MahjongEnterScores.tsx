import { useState, useMemo } from 'react';
import {
  MahjongGameSettings,
  MahjongRoundRecord,
  MahjongSetData,
  RULES,
  calculateHandScore,
  calculateScoreDeltas,
  checkReignOfTerror,
  getVisibleRuleIds,
  getAutoAppliedRuleNames
} from '../../utils/MahjongUtils';

interface Props {
  players: string[];
  settings: MahjongGameSettings;
  onConfirm: (record: MahjongRoundRecord) => void;
  onCancel: () => void;
}

const RULE_GROUPS = [
  { label: '+2 POINTS EACH', ids: ['one_chance', 'lucky_pair'] },
  { label: '+10 POINTS', ids: ['semi_concealed'] },
  { label: '1 DOUBLE (×2)', ids: ['fully_concealed', 'all_simples', 'one_suit_with_honors', 'all_honors_terminals', 'off_dead_wall', 'robbing_kong', 'bottom_of_sea', 'riichi', '1_9_run'] },
  { label: '2 DOUBLES (×4)', ids: ['all_pairs', 'triple_pung', 'little_three_dragons'] },
  { label: '4 DOUBLES (×16)', ids: ['one_suit_no_honors'] },
  { label: 'SPECIAL', ids: ['limit_hand'] },
];

function MahjongEnterScores({ players, settings, onConfirm, onCancel }: Props) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [winnerIndex, setWinnerIndex] = useState(-2);   // -2=nothing selected, -1=draw
  const [isSelfDrawn, setIsSelfDrawn] = useState(false);
  const [drawnFromIndex, setDrawnFromIndex] = useState(-2); // -2=nothing selected
  const [sets, setSets] = useState<MahjongSetData[]>([]);
  const [selectedRuleIds, setSelectedRuleIds] = useState(new Set<string>());

  const isReignOfTerror = checkReignOfTerror(settings, winnerIndex);

  const visibleRuleIds = useMemo(
    () => getVisibleRuleIds(sets, isSelfDrawn),
    [sets, isSelfDrawn]
  );

  const autoRuleNames = useMemo(
    () => getAutoAppliedRuleNames(sets, Array.from(selectedRuleIds)),
    [sets, selectedRuleIds]
  );

  const { handScore: computedHandScore, isLimitHand, rulesApplied } = useMemo(() => {
    if (winnerIndex < 0) return { handScore: 0, isLimitHand: false, rulesApplied: [] };
    return calculateHandScore(
      { sets, isSelfDrawn, selectedRuleIds: Array.from(selectedRuleIds) },
      settings.baseWinScore,
      settings.limitValue
    );
  }, [sets, isSelfDrawn, selectedRuleIds, settings.baseWinScore, settings.limitValue, winnerIndex]);

  const finalHandScore = isReignOfTerror ? settings.limitValue : computedHandScore;

  const scoreDeltas = useMemo(() => {
    if (winnerIndex < 0) return [0, 0, 0, 0];
    const drawnFrom = isSelfDrawn ? -1 : drawnFromIndex;
    return calculateScoreDeltas(finalHandScore, winnerIndex, drawnFrom, settings.dealerIndex);
  }, [finalHandScore, winnerIndex, isSelfDrawn, drawnFromIndex, settings.dealerIndex]);

  const step1CanProceed =
    winnerIndex !== -2 &&
    (winnerIndex < 0 || isSelfDrawn || drawnFromIndex >= 0);

  const handleNext = () => {
    if (step === 1 && winnerIndex === -1) {
      setStep(4); // draw: skip sets & rules
    } else {
      setStep(s => (s + 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleBack = () => {
    if (step === 4 && winnerIndex === -1) {
      setStep(1);
    } else {
      setStep(s => (s - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleConfirm = () => {
    const record: MahjongRoundRecord = {
      roundNumber: settings.roundHistory.length + 1,
      winnerIndex,
      drawnFromIndex: isSelfDrawn ? -1 : drawnFromIndex,
      dealerIndex: settings.dealerIndex,
      prevailingWind: settings.prevailingWind,
      handScore: finalHandScore,
      scoreDeltas,
      isLimitHand: isLimitHand || isReignOfTerror,
      isReignOfTerror,
      rulesApplied
    };
    onConfirm(record);
  };

  const toggleRule = (id: string) => {
    setSelectedRuleIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const addSet = () => {
    if (sets.length < 4) {
      setSets(prev => [...prev, { type: 'pung', isConcealed: false, isTerminalOrHonor: false, luckyMultiplier: 0 }]);
    }
  };

  const removeLastSet = () => setSets(prev => prev.slice(0, -1));

  const updateSet = (index: number, updates: Partial<MahjongSetData>) => {
    setSets(prev => prev.map((set, i) => {
      if (i !== index) return set;
      const updated = { ...set, ...updates };
      if ('isTerminalOrHonor' in updates && !updates.isTerminalOrHonor) {
        updated.luckyMultiplier = 0;
      }
      return updated;
    }));
  };

  const dealerName = players[settings.dealerIndex];

  return (
    <div className="mahjong-modal-overlay">
      <div className="container" style={{ maxWidth: '500px', width: '100%', textAlign: 'left' }}>

        {/* Header */}
        <h1 className="title" style={{ marginBottom: '4px', fontSize: '38px' }}>
          Round {settings.roundHistory.length + 1}
        </h1>
        <div className="table-subtitle" style={{ marginBottom: '16px' }}>
          {settings.prevailingWind} Wind · Dealer: {dealerName}
          {settings.consecutiveWins > 0 && ` · ${settings.consecutiveWins} in a row`}
          {isReignOfTerror && (
            <span style={{ color: '#fc8181', display: 'block' }}>⚠ REIGN OF TERROR</span>
          )}
        </div>

        {/* Step 1: Winner & Discard */}
        {step === 1 && (
          <div>
            <p className="setting-small-header">WHO WON?</p>
            <div className="rule-toggle-group">
              {players.map((player, i) => (
                <button
                  key={i}
                  className="list-button"
                  style={{ marginTop: '4px' }}
                  aria-pressed={winnerIndex === i}
                  onClick={() => { setWinnerIndex(i); setDrawnFromIndex(-2); setIsSelfDrawn(false); }}>
                  {player}{i === settings.dealerIndex ? ' ★' : ''}
                </button>
              ))}
              <button
                className="list-button"
                style={{ marginTop: '4px' }}
                aria-pressed={winnerIndex === -1}
                onClick={() => { setWinnerIndex(-1); setIsSelfDrawn(false); setDrawnFromIndex(-1); }}>
                No Winner
              </button>
            </div>

            {winnerIndex >= 0 && (
              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', fontFamily: "'m5x7', monospace", cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    className="setting-checkbox"
                    checked={isSelfDrawn}
                    onChange={e => { setIsSelfDrawn(e.target.checked); setDrawnFromIndex(-2); }}
                  />
                  Self-Drawn
                </label>

                {!isSelfDrawn && (
                  <div style={{ marginTop: '12px' }}>
                    <p className="setting-small-header">DISCARDED BY:</p>
                    <div className="rule-toggle-group">
                      {players.map((player, i) => i !== winnerIndex && (
                        <button
                          key={i}
                          className="list-button"
                          style={{ marginTop: '4px' }}
                          aria-pressed={drawnFromIndex === i}
                          onClick={() => setDrawnFromIndex(i)}>
                          {player}{i === settings.dealerIndex ? ' ★' : ''}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Sets */}
        {step === 2 && (
          <div>
            <p className="setting-small-header">PUNGS & KONGS</p>
            <p style={{ fontFamily: "'m5x7', monospace", fontSize: '22px', color: '#a0aec0', marginBottom: '8px' }}>
              Add up to 4 melds (excluding the pair)
            </p>

            {sets.map((set, i) => (
              <div key={i} style={{ border: '1px solid #4a5568', borderRadius: '6px', padding: '12px', marginBottom: '10px' }}>
                <p className="setting-small-header" style={{ marginTop: 0 }}>Set {i + 1}</p>

                <div className="rule-toggle-group" style={{ marginBottom: '8px' }}>
                  <button className="list-button" style={{ marginTop: '4px' }} aria-pressed={set.type === 'pung'} onClick={() => updateSet(i, { type: 'pung' })}>Pung</button>
                  <button className="list-button" style={{ marginTop: '4px' }} aria-pressed={set.type === 'kong'} onClick={() => updateSet(i, { type: 'kong' })}>Kong</button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'m5x7', monospace", fontSize: '24px', cursor: 'pointer' }}>
                    <input type="checkbox" className="setting-checkbox" checked={set.isConcealed} onChange={e => updateSet(i, { isConcealed: e.target.checked })} />
                    Concealed
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'m5x7', monospace", fontSize: '24px', cursor: 'pointer' }}>
                    <input type="checkbox" className="setting-checkbox" checked={set.isTerminalOrHonor} onChange={e => updateSet(i, { isTerminalOrHonor: e.target.checked })} />
                    Terminal/Honor
                  </label>
                </div>

                {set.isTerminalOrHonor && (
                  <div className="rule-toggle-group" style={{ marginTop: '8px' }}>
                    <button className="list-button" style={{ marginTop: '4px' }} aria-pressed={set.luckyMultiplier === 0} onClick={() => updateSet(i, { luckyMultiplier: 0 })}>Normal</button>
                    <button className="list-button" style={{ marginTop: '4px' }} aria-pressed={set.luckyMultiplier === 1} onClick={() => updateSet(i, { luckyMultiplier: 1 })}>Lucky</button>
                    <button className="list-button" style={{ marginTop: '4px' }} aria-pressed={set.luckyMultiplier === 2} onClick={() => updateSet(i, { luckyMultiplier: 2 })}>Double Lucky</button>
                  </div>
                )}
              </div>
            ))}

            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              {sets.length < 4 && (
                <button className="list-button" style={{ marginTop: '4px' }} onClick={addSet}>+ Add Set</button>
              )}
              {sets.length > 0 && (
                <button className="list-button" style={{ marginTop: '4px' }} onClick={removeLastSet}>- Remove Set</button>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Rules */}
        {step === 3 && (
          <div>
            <p className="setting-small-header">SELECT RULES</p>
            <p style={{ fontFamily: "'m5x7', monospace", fontSize: '22px', color: '#a0aec0', marginBottom: '8px' }}>
              Prevailing Wind: {settings.prevailingWind}
            </p>

            {RULE_GROUPS.map(group => {
              const visibleInGroup = group.ids.filter(id => visibleRuleIds.has(id));
              if (visibleInGroup.length === 0) return null;
              return (
                <div key={group.label} style={{ marginBottom: '12px' }}>
                  <p className="setting-small-header">{group.label}</p>
                  <div className="rule-toggle-group">
                    {visibleInGroup.map(id => {
                      const rule = RULES.find(r => r.id === id);
                      if (!rule) return null;
                      return (
                        <button
                          key={id}
                          className="list-button"
                          style={{ marginTop: '4px' }}
                          aria-pressed={selectedRuleIds.has(id)}
                          title={rule.description}
                          onClick={() => toggleRule(id)}>
                          {rule.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {autoRuleNames.length > 0 && (
              <div style={{ marginTop: '12px' }}>
                <p className="setting-small-header">AUTO-APPLIED</p>
                <div className="rule-toggle-group">
                  {autoRuleNames.map(name => (
                    <span
                      key={name}
                      className="list-button"
                      style={{ marginTop: '4px', opacity: 0.6, cursor: 'default' }}>
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Preview & Confirm */}
        {step === 4 && (
          <div>
            <p className="setting-small-header">SCORE PREVIEW</p>

            {winnerIndex === -1 ? (
              <p style={{ fontFamily: "'m5x7', monospace", fontSize: '22px', color: '#e4e4e4', margin: '12px 0' }}>
                No winner — all scores unchanged
              </p>
            ) : (
              <>
                <div style={{ fontFamily: "'m5x7', monospace", fontSize: '22px', color: '#a0aec0', margin: '8px 0 12px 0' }}>
                  <div>Winner: <span style={{ color: '#e4e4e4' }}>{players[winnerIndex]}</span></div>
                  <div>
                    {isSelfDrawn ? 'Self-Drawn' : `Discarded by: ${players[drawnFromIndex]}`}
                  </div>
                  <div>Hand score: <span style={{ color: '#e4e4e4' }}>{finalHandScore}</span>
                    {(isLimitHand || isReignOfTerror) && <span style={{ color: '#fc8181' }}> (LIMIT)</span>}
                  </div>
                </div>

                {isReignOfTerror && (
                  <div style={{ background: 'rgba(252,129,129,0.15)', border: '1px solid #fc8181', borderRadius: '6px', padding: '8px 12px', marginBottom: '12px', fontFamily: "'m5x7', monospace", fontSize: '22px', color: '#fc8181' }}>
                    ⚠ REIGN OF TERROR — {players[winnerIndex]} wins the limit hand but loses the deal!
                  </div>
                )}
              </>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'m5x7', monospace", fontSize: '22px' }}>
              <tbody>
                {players.map((player, i) => (
                  <tr key={i}>
                    <td style={{ padding: '4px 8px', color: '#a0aec0' }}>
                      {player}{i === settings.dealerIndex ? ' ★' : ''}
                    </td>
                    <td style={{ padding: '4px 8px', textAlign: 'right' }}>
                      <span className={scoreDeltas[i] > 0 ? 'score-positive' : scoreDeltas[i] < 0 ? 'score-negative' : 'score-zero'}>
                        {scoreDeltas[i] > 0 ? `+${scoreDeltas[i]}` : scoreDeltas[i] === 0 ? '—' : scoreDeltas[i]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '20px', alignItems: 'center', justifyContent: 'center' }}>
          <button
            className="link"
            style={{ cursor: 'pointer' }}
            onClick={step === 1 ? onCancel : handleBack}>
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          {step < 4 ? (
            <button
              className="primary-button"
              style={{ marginTop: 0, width: '140px' }}
              onClick={handleNext}
              disabled={step === 1 && !step1CanProceed}>
              Next
            </button>
          ) : (
            <button
              className="primary-button"
              style={{ marginTop: 0, width: '140px' }}
              onClick={handleConfirm}>
              Confirm
            </button>
          )}
        </div>

        {/* Step indicator */}
        <p className="step-label" style={{ textAlign: 'center', marginTop: '12px' }}>
          {winnerIndex === -1 ? 'STEP 1 of 2' : `STEP ${step} of 4`}
        </p>
      </div>
    </div>
  );
}

export default MahjongEnterScores;
