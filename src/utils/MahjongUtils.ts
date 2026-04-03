export type Wind = 'East' | 'South' | 'West' | 'North';

export const WINDS: Wind[] = ['East', 'South', 'West', 'North'];

export interface MahjongSetData {
  type: 'pung' | 'kong';
  isConcealed: boolean;
  isTerminalOrHonor: boolean;
  luckyMultiplier: 0 | 1 | 2; // 0=normal, 1=lucky(×2), 2=double-lucky(×4)
}

export interface MahjongRoundRecord {
  roundNumber: number;
  winnerIndex: number;    // -1 = no winner (draw)
  drawnFromIndex: number; // -1 = self-drawn
  dealerIndex: number;
  prevailingWind: string;
  handScore: number;
  scoreDeltas: number[];
  isLimitHand: boolean;
  isReignOfTerror: boolean;
  rulesApplied: string[];
}

export interface MahjongGameSettings {
  startingPlayerScore: number;
  limitValue: number;
  baseWinScore: number;
  reignOfTerrorLimit: number;
  dealerIndex: number;
  consecutiveWins: number;
  timesDealerWon: number;
  prevailingWind: Wind;
  roundHistory: MahjongRoundRecord[];
}

export interface ScoreInput {
  sets: MahjongSetData[];
  isSelfDrawn: boolean;
  selectedRuleIds: string[];
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  flatPoints: number;
  doubles: number;
  autoApplied: boolean;
}

export const RULES: Rule[] = [
  // User-selectable, flat points
  { id: 'one_chance', name: 'One Chance', description: 'Only one possible winning tile (+2 pts)', flatPoints: 2, doubles: 0, autoApplied: false },
  { id: 'lucky_pair', name: 'Lucky Pair', description: 'Pair is prevailing wind or dragon (+2 pts)', flatPoints: 2, doubles: 0, autoApplied: false },
  { id: 'semi_concealed', name: 'Semi-Concealed', description: 'All sets concealed except winning tile (+10 pts)', flatPoints: 10, doubles: 0, autoApplied: false },
  // User-selectable, doubles
  { id: 'fully_concealed', name: 'Fully Concealed', description: 'Entire hand concealed + self-drawn (1 double)', flatPoints: 0, doubles: 1, autoApplied: false },
  { id: 'all_simples', name: 'All Simples', description: 'No terminals or honors (1 double)', flatPoints: 0, doubles: 1, autoApplied: false },
  { id: 'one_suit_with_honors', name: 'One Suit w/Honors', description: 'All tiles one suit + winds/dragons (1 double)', flatPoints: 0, doubles: 1, autoApplied: false },
  { id: 'all_honors_terminals', name: 'All Honors/Terms', description: 'Terminal or honor in every set (1 double)', flatPoints: 0, doubles: 1, autoApplied: false },
  { id: 'off_dead_wall', name: 'Off Dead Wall', description: 'Winning tile drawn after kong (1 double)', flatPoints: 0, doubles: 1, autoApplied: false },
  { id: 'robbing_kong', name: 'Robbing a Kong', description: 'Winning tile taken from declared kong (1 double)', flatPoints: 0, doubles: 1, autoApplied: false },
  { id: 'bottom_of_sea', name: 'Bottom of Sea', description: 'Last tile before dead wall (1 double)', flatPoints: 0, doubles: 1, autoApplied: false },
  { id: 'riichi', name: 'Riichi', description: 'Hand laid down face-up (1 double)', flatPoints: 0, doubles: 1, autoApplied: false },
  { id: '1_9_run', name: '1-9 Run', description: 'Three chows 1-9 same suit (1 double)', flatPoints: 0, doubles: 1, autoApplied: false },
  { id: 'all_pairs', name: 'All Pairs', description: 'Seven different pairs (2 doubles)', flatPoints: 0, doubles: 2, autoApplied: false },
  { id: 'triple_pung', name: 'Triple Pung', description: 'Three pungs same number, different suits (2 doubles)', flatPoints: 0, doubles: 2, autoApplied: false },
  { id: 'little_three_dragons', name: 'Little 3 Dragons', description: '2 dragon pungs/kongs + 1 dragon pair (2 doubles)', flatPoints: 0, doubles: 2, autoApplied: false },
  { id: 'one_suit_no_honors', name: 'One Suit No Honors', description: 'All tiles same suit, no honors (4 doubles)', flatPoints: 0, doubles: 4, autoApplied: false },
  { id: 'limit_hand', name: 'Limit Hand', description: 'Special hand worth the limit value', flatPoints: 0, doubles: 0, autoApplied: false },
  // Auto-applied (computed from input, not user-selectable)
  { id: 'worthless', name: 'Worthless', description: 'No pungs/kongs and no lucky pair (auto 1 double)', flatPoints: 0, doubles: 1, autoApplied: true },
  { id: 'three_concealed_pungs', name: '3 Conc. Pungs', description: '3+ concealed pungs (auto 2 doubles)', flatPoints: 0, doubles: 2, autoApplied: true },
  { id: 'all_pungs', name: 'All Pungs', description: '4 pungs/kongs (auto 1 double)', flatPoints: 0, doubles: 1, autoApplied: true },
  { id: 'three_kongs', name: 'Three Kongs', description: '3+ kongs (auto 2 doubles)', flatPoints: 0, doubles: 2, autoApplied: true },
];

// Returns current wind of a player given who the dealer (East) is
export function getPlayerWind(playerIndex: number, dealerIndex: number): Wind {
  return WINDS[(playerIndex - dealerIndex + 4) % 4];
}

// Returns true if this win would trigger Reign of Terror
export function checkReignOfTerror(settings: MahjongGameSettings, winnerIndex: number): boolean {
  return (
    winnerIndex === settings.dealerIndex &&
    settings.reignOfTerrorLimit > 0 &&
    settings.consecutiveWins + 1 >= settings.reignOfTerrorLimit
  );
}

export function calculateHandScore(
  input: ScoreInput,
  baseWinScore: number,
  limitValue: number
): { handScore: number; isLimitHand: boolean; rulesApplied: string[] } {
  const rulesApplied: string[] = [];

  // Limit Hand overrides everything
  if (input.selectedRuleIds.includes('limit_hand')) {
    return { handScore: limitValue, isLimitHand: true, rulesApplied: ['Limit Hand'] };
  }

  let score = baseWinScore;

  // Add set scores
  for (const set of input.sets) {
    let setScore = (set.type === 'kong' ? 8 : 2) * baseWinScore;
    if (set.isTerminalOrHonor) setScore *= 2;
    if (set.isConcealed) setScore *= 2;
    if (set.luckyMultiplier === 1) setScore *= 2;
    else if (set.luckyMultiplier === 2) setScore *= 4;
    score += setScore;
  }

  // Collect flat points and doubles from user-selected rules
  let flatPoints = 0;
  let doubles = 0;

  for (const ruleId of input.selectedRuleIds) {
    const rule = RULES.find(r => r.id === ruleId && !r.autoApplied && r.id !== 'limit_hand');
    if (rule) {
      flatPoints += rule.flatPoints;
      doubles += rule.doubles;
      rulesApplied.push(rule.name);
    }
  }

  // Self-drawn adds flat points
  if (input.isSelfDrawn) {
    flatPoints += 2;
    rulesApplied.push('Self-Drawn');
  }

  // Auto-applied rules
  const pungCount = input.sets.filter(s => s.type === 'pung').length;
  const kongCount = input.sets.filter(s => s.type === 'kong').length;
  const totalPungsKongs = pungCount + kongCount;
  const concealedPungs = input.sets.filter(s => s.type === 'pung' && s.isConcealed).length;
  const hasLuckyPair = input.selectedRuleIds.includes('lucky_pair');
  const hasAllPairs = input.selectedRuleIds.includes('all_pairs');

  if (totalPungsKongs === 0 && !hasLuckyPair && !hasAllPairs) {
    doubles += 1;
    rulesApplied.push('Worthless');
  }
  if (concealedPungs >= 3) {
    doubles += 2;
    rulesApplied.push('Three Concealed Pungs');
  }
  if (totalPungsKongs >= 4) {
    doubles += 1;
    rulesApplied.push('All Pungs');
  }
  if (kongCount >= 3) {
    doubles += 2;
    rulesApplied.push('Three Kongs');
  }

  score += flatPoints;
  score = score * Math.pow(2, doubles);
  score = Math.round(score / 10) * 10;

  let isLimitHand = false;
  if (limitValue > 0 && score > limitValue) {
    score = limitValue;
    isLimitHand = true;
  }

  return { handScore: score, isLimitHand, rulesApplied };
}

// Returns score adjustments for each player. Winner is positive, losers are negative. Sum = 0.
export function calculateScoreDeltas(
  handScore: number,
  winnerIndex: number,
  drawnFromIndex: number, // -1 = self-drawn
  dealerIndex: number
): number[] {
  const deltas = [0, 0, 0, 0];

  if (winnerIndex < 0) return deltas; // draw — all zeros

  const selfDrawn = drawnFromIndex < 0;
  const dealerWon = winnerIndex === dealerIndex;

  if (dealerWon && !selfDrawn) {
    // Dealer wins from discard: discard player pays ×6, others pay 0
    deltas[winnerIndex] = handScore * 6;
    deltas[drawnFromIndex] = -(handScore * 6);
  } else if (dealerWon && selfDrawn) {
    // Dealer wins self-drawn: all 3 losers pay ×2
    deltas[winnerIndex] = handScore * 6;
    for (let i = 0; i < 4; i++) {
      if (i !== winnerIndex) deltas[i] = -(handScore * 2);
    }
  } else if (!dealerWon && !selfDrawn) {
    // Non-dealer wins from discard: discard player pays ×4, others pay 0
    deltas[winnerIndex] = handScore * 4;
    deltas[drawnFromIndex] = -(handScore * 4);
  } else {
    // Non-dealer wins self-drawn: dealer pays ×2, other 2 losers pay ×1
    deltas[winnerIndex] = handScore * 4;
    deltas[dealerIndex] = -(handScore * 2);
    for (let i = 0; i < 4; i++) {
      if (i !== winnerIndex && i !== dealerIndex) {
        deltas[i] = -(handScore * 1);
      }
    }
  }

  return deltas;
}

// Computes updated dealer state after a round is committed
export function advanceDealer(
  settings: MahjongGameSettings,
  winnerIndex: number,
  isReignOfTerror: boolean,
  nextRound: number
): Pick<MahjongGameSettings, 'dealerIndex' | 'consecutiveWins' | 'timesDealerWon' | 'prevailingWind'> {
  // Dealer wins only if they won AND it's not a reign of terror (which forces rotation)
  const dealerWon = winnerIndex === settings.dealerIndex && !isReignOfTerror && winnerIndex >= 0;

  let newDealerIndex: number;
  let newConsecutiveWins: number;
  let newTimesDealerWon: number;

  if (dealerWon) {
    newDealerIndex = settings.dealerIndex;
    newConsecutiveWins = settings.consecutiveWins + 1;
    newTimesDealerWon = settings.timesDealerWon + 1;
  } else {
    newDealerIndex = (settings.dealerIndex + 1) % 4;
    newConsecutiveWins = 0;
    newTimesDealerWon = settings.timesDealerWon;
  }

  // Prevailing wind advances every 4 dealer-change rounds
  // (nextRound - 1 - newTimesDealerWon) = number of times the dealer has changed
  const dealerChanges = Math.max(0, nextRound - 1 - newTimesDealerWon);
  const windIndex = Math.floor(dealerChanges / 4) % 4;

  return {
    dealerIndex: newDealerIndex,
    consecutiveWins: newConsecutiveWins,
    timesDealerWon: newTimesDealerWon,
    prevailingWind: WINDS[windIndex]
  };
}

// Game ends after 16 + timesDealerWon rounds (one full rotation + dealer-bonus rounds)
export function isGameOver(currRound: number, timesDealerWon: number): boolean {
  return currRound > 16 + timesDealerWon;
}

// Returns rule IDs that should be shown given the current sets and draw mode
export function getVisibleRuleIds(sets: MahjongSetData[], isSelfDrawn: boolean): Set<string> {
  const result = new Set<string>();

  // Always visible
  result.add('one_chance');
  result.add('lucky_pair');
  result.add('robbing_kong');
  result.add('bottom_of_sea');
  result.add('limit_hand');
  result.add('one_suit_with_honors');
  result.add('riichi');

  const pungCount = sets.filter(s => s.type === 'pung').length;
  const kongCount = sets.filter(s => s.type === 'kong').length;
  const totalSets = sets.length;
  const concealedCount = sets.filter(s => s.isConcealed).length;
  const unconcealed = sets.filter(s => !s.isConcealed).length;
  const terminalHonorCount = sets.filter(s => s.isTerminalOrHonor).length;

  if (unconcealed < 2 && !isSelfDrawn) result.add('semi_concealed');
  if (totalSets > 0 && concealedCount === totalSets && isSelfDrawn) result.add('fully_concealed');
  if (terminalHonorCount === 0) result.add('all_simples');
  if (pungCount === 0 && kongCount === 0) result.add('all_pairs');
  if (pungCount + kongCount >= 3) result.add('triple_pung');
  if (terminalHonorCount >= 2) result.add('little_three_dragons');
  if (terminalHonorCount === 0) result.add('one_suit_no_honors');
  if (totalSets > 0 && terminalHonorCount === totalSets) result.add('all_honors_terminals');
  if (kongCount >= 1) result.add('off_dead_wall');
  if (totalSets <= 1) result.add('1_9_run');

  return result;
}

// Returns names of auto-applied rules that will fire given current state
export function getAutoAppliedRuleNames(sets: MahjongSetData[], selectedRuleIds: string[]): string[] {
  const names: string[] = [];
  const pungCount = sets.filter(s => s.type === 'pung').length;
  const kongCount = sets.filter(s => s.type === 'kong').length;
  const totalPungsKongs = pungCount + kongCount;
  const concealedPungs = sets.filter(s => s.type === 'pung' && s.isConcealed).length;
  const hasLuckyPair = selectedRuleIds.includes('lucky_pair');
  const hasAllPairs = selectedRuleIds.includes('all_pairs');

  if (totalPungsKongs === 0 && !hasLuckyPair && !hasAllPairs) names.push('Worthless');
  if (concealedPungs >= 3) names.push('3 Concealed Pungs');
  if (totalPungsKongs >= 4) names.push('All Pungs');
  if (kongCount >= 3) names.push('Three Kongs');

  return names;
}
