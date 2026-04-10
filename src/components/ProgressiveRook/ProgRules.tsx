import { useNavigate } from 'react-router-dom';

interface Section {
  heading: string;
  body?: string;
  items?: string[];
  table?: { col1: string; col2: string; rows: [string, string][] };
}

const sections: Section[] = [
  {
    heading: 'Overview',
    body: 'Progressive Rook is a trick-taking card game for 3–5 players using a 57-card Rook deck. It is played over 11 rounds. Each round has a meld requirement (sets and/or runs) that must be laid down before trick-taking. Players bid for the right to name trump, then try to capture point-value cards in tricks. The player with the highest cumulative score after all 11 rounds wins.',
  },
  {
    heading: 'The Deck',
    body: 'The Rook deck contains 57 cards: four suits (Black, Red, Green, Yellow) each numbered 1–14, plus the Rook Bird card. Only certain cards have point value:',
    items: [
      'Rook Bird — 20 points',
      '1 (in each suit) — 15 points each',
      '14 (in each suit) — 10 points each',
      '10 (in each suit) — 10 points each',
      '5 (in each suit) — 5 points each',
    ],
  },
  {
    heading: 'The 11 Rounds',
    body: 'Each round has a meld requirement. The dealer rotates clockwise each round.',
    table: {
      col1: 'Round',
      col2: 'Meld Requirement',
      rows: [
        ['1', '2 Sets'],
        ['2', '1 Run, 1 Set'],
        ['3', '2 Runs'],
        ['4', '3 Sets'],
        ['5', '1 Run, 2 Sets'],
        ['6', '2 Runs, 1 Set'],
        ['7', '3 Runs'],
        ['8', '4 Sets'],
        ['9', '1 Run, 3 Sets'],
        ['10', '2 Runs, 2 Sets'],
        ['11', '3 Runs, 1 Set'],
      ],
    },
  },
  {
    heading: 'Sets and Runs',
    items: [
      'Set — 3 or more cards of the same number from different suits (e.g. three 7s).',
      'Run — 4 or more consecutive cards of the same suit (e.g. Red 5, 6, 7, 8).',
      'Melds are laid face-up on the table before trick-taking begins.',
      'Cards used in melds cannot be played in tricks.',
    ],
  },
  {
    heading: 'The Nest',
    body: 'Cards not dealt to players form the nest, a face-down kitty in the center. After bidding, the winning bidder picks up the nest, adds those cards to their hand, then discards the same number of cards face-down. Discarded point-value cards count for the non-bidding players at the end of the round. The Rook Bird cannot be discarded into the nest.',
  },
  {
    heading: 'Bidding',
    items: [
      'Bidding starts with the player to the left of the dealer and goes clockwise.',
      'Each player bids or passes. A player who passes may not bid again that round.',
      'Bids must be multiples of 5 and higher than the previous bid.',
      'The minimum bid is 70.',
      'The highest bidder wins the right to pick up the nest and name trump.',
    ],
  },
  {
    heading: 'Trump',
    body: 'After picking up the nest, the winning bidder names one of the four suits as trump. The Rook Bird always belongs to trump and is the highest trump card, ranking above the 1.',
    items: [
      'Trump rank (high to low): Rook Bird → 1 → 14 → 13 → 12 → 11 → 10 → 9 → 8 → 7 → 6 → 5 → 4 → 3 → 2',
    ],
  },
  {
    heading: 'Trick-Taking',
    items: [
      'The winning bidder leads the first trick.',
      'Players must follow the led suit if able.',
      'If unable to follow suit, any card (including trump) may be played.',
      'The highest trump wins the trick if any trump was played; otherwise the highest card of the led suit wins.',
      'The trick winner leads the next trick.',
      'If the Rook Bird is led, all players must play their lowest card of any suit, and the Rook Bird wins the trick.',
    ],
  },
  {
    heading: 'Scoring',
    items: [
      'If the bidder captures at least as many points as their bid, they score the actual points captured.',
      'If the bidder falls short of their bid, they are "set" — they lose their bid amount from their score.',
      'Non-bidding players always score their actual points captured regardless of the bid outcome.',
      'The nest\'s remaining cards (after the bidder\'s discards) count for the non-bidding players.',
      'Double-12 Rule: if a player\'s running total reaches exactly 120, their score is doubled to 240.',
    ],
  },
  {
    heading: 'Winning',
    body: 'The player with the highest cumulative score after all 11 rounds wins.',
  },
];

function ProgRules() {
  const navigate = useNavigate();

  return (
    <div className='container' style={{ maxWidth: '480px', margin: '0 auto' }}>
      <h1 className='title'>Progressive Rook Rules</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
        {sections.map(({ heading, body, items, table }) => (
          <div key={heading}>
            <div style={{ fontFamily: "'m5x7', monospace", fontSize: '22px', color: '#4395A7', marginBottom: '6px' }}>
              {heading}
            </div>
            {body && (
              <p style={{ margin: '0 0 8px 0', fontSize: '16px', lineHeight: '1.5' }}>
                {body}
              </p>
            )}
            {items && (
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '16px', lineHeight: '1.7' }}>
                {items.map(item => <li key={item}>{item}</li>)}
              </ul>
            )}
            {table && (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '4px 8px', borderBottom: '1px solid #4a5568', color: '#a0aec0' }}>{table.col1}</th>
                    <th style={{ textAlign: 'left', padding: '4px 8px', borderBottom: '1px solid #4a5568', color: '#a0aec0' }}>{table.col2}</th>
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map(([c1, c2]) => (
                    <tr key={c1}>
                      <td style={{ padding: '4px 8px', borderBottom: '1px solid #2d3748' }}>{c1}</td>
                      <td style={{ padding: '4px 8px', borderBottom: '1px solid #2d3748' }}>{c2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '32px' }}>
        <button className='link' onClick={() => navigate('/')}>Home</button>
      </div>
    </div>
  );
}

export default ProgRules;
