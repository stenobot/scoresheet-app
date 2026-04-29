import { useNavigate } from 'react-router-dom';

interface Section {
  heading: string;
  body?: string;
  items?: string[];
  table?: { col1: string; col2: string; col3: string; rows: [string, string, string][] };
}

const sections: Section[] = [
  {
    heading: 'Overview',
    body: 'Progressive Rook is a Rummy-style game for 3-5 players using a 57-card Rook deck. It is played over 11 rounds.',
  },
  {
    heading: 'Setup',
    body: 'The game uses the entire 57-card Rook deck, including 2 Rook (wild) cards, and is played over 11 rounds. Collectively choose a starting dealer. Each round, the dealer distributes a specific number of cards to each player starting with 6 cards for round 1. That number goes up by 1 each subsequent round. The dealer places the remaining cards face down into a general draw pile, and flips the top card over to create a separate discard pile. Play begins with the player to the left of the dealer.',
  },
  {
    heading: 'Round Play',
    body: 'On each player\'s turn, they must draw a card, and they must discard a card. Here are the details:',
    items: [
      'First, they must draw a card from the top of either the face-down Draw pile or the face-up Discard pile. If the Discard pile is empty, they must use the Draw pile.',
      'If they have met the Round Goal (see table below), they can optionally lay down the eligible sets/runs in front of them face up. They can only "lay down" once per round, and it must be the same amount of sets/runs as specified in the Round Goal. For example, if they are on Round 2, they can lay down a total of 1 Run and 1 Set. They cannot lay down 2 sets, even if they have 2 complete sets in their hand.',
      'If they have already laid down their sets/runs, they can optionally place other cards from their hand on their own sets/runs or their opponents\'s sets/runs. For example, if they draw a card that plays at the beginning or end of an opponent\s run, they can keep it concealed in their hand and play it during their turn after they have laid down. When playing a card on a laid down set or run, it must be a legal play for that set or run. (See Sets and Runs details below.) If a laid down set or run contains a Rook card, and the player has the card that the Rook is substituted for, they can swap it with the Rook and then immediately play the Rook somewhere else. They cannot play on another player\'s sets/runs until they have laid down their own sets/runs.',
      'Lastly, they must discard a card from the remaining cards in their hand (if they have any). They can discard any card, including the one they just drew.',
    ],
    table: {
      col1: 'Round',
      col2: 'Cards Dealt',
      col3: 'Round Goal',
      rows: [
        ['1', '6', '2 Sets'],
        ['2', '7', '1 Run, 1 Set'],
        ['3', '8', '2 Runs'],
        ['4', '9', '3 Sets'],
        ['5', '10', '1 Run, 2 Sets'],
        ['6', '11', '2 Runs, 1 Set'],
        ['7', '12', '3 Runs'],
        ['8', '13', '4 Sets'],
        ['9', '14', '1 Run, 3 Sets'],
        ['10', '15', '2 Runs, 2 Sets'],
        ['11', '16', '3 Runs, 1 Set'],
      ],
    },
  },
  {
    heading: 'Stealing from the discard pile',
    body:'When a player discards a card at the end of their turn, that card becomes available for the next player to draw at the start of their turn. If they decide to take the discard, it serves as their draw for that turn. If they decide not to take the discard, it becomes available for another player to steal. All remaining players other than the player who discarded and the current player will have a chance to steal the discard, but only if the player before them (going around the table in order) passes on it. When a card is stolen, the next card in the discard pile does not become available to steal. The next available steal will be the current player\'s discard. When a player steals a discard, it does not count as their upcoming draw. It is an extra card in their deck. There is no limit for how many cards a player can steal. But remember, points are bad! If a player steals too many cards, they might end up in big trouble at the end of the round.',
  },
  {
    heading: 'Sets and Runs',
    body:'A set is 3 or more cards of the same number. A run is 4 or more cards of the same suit in sequential order. For runs, the lowest card (1) can also be the highest card. For example, a run can be 12, 13, 14, 1. Only the 1 card can be used in this way. For example: 13, 14, 1, 2 is not a legal run. The Rook card is a wild card and can be used as a substitute for any card when forming sets or runs. For example, if you have a 3 of Red, a 4 of Red, a 6 of red, you can use a Rook as a 5 of Red when you lay down the run. Or if you have two 7s and the Rook, you can use the Rook as a third 7 to when you lay down the set.',
  },
  {
    heading: 'Ending a round',
    body:'A round ends when a player goes out (lays down all their cards), and additionally gets rid of all their cards by discarding or playing them on sets/runs. If a player goes out during their turn, the round ends immediately. That player wins the round with a score of 0, and all other players score points based on the cards remaining in their hands.',
  },
  {
    heading: 'Scoring',
    body:'In Progressive Rook, points are bad. You want a score as close to zero as possible. Points are scored based on the cards remaining in each player\'s hand when a player goes out. So, when a player goes out, their score is zero. All other players must score the cards remaining in their hands. Each card is worth its face value, except for the 1 card (which is worth 15) and the Rook card (which is worth 50).'
  },
  {
    heading: 'Ending the game',
    body:'The game ends when the 11th round is completed. The player with the lowest total score after 11 rounds is the winner.',
  }
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
                    <th style={{ textAlign: 'left', padding: '4px 8px', borderBottom: '1px solid #4a5568', color: '#a0aec0' }}>{table.col3}</th>
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map(([c1, c2, c3]) => (
                    <tr key={c1}>
                      <td style={{ padding: '4px 8px', borderBottom: '1px solid #2d3748' }}>{c1}</td>
                      <td style={{ padding: '4px 8px', borderBottom: '1px solid #2d3748' }}>{c2}</td>
                      <td style={{ padding: '4px 8px', borderBottom: '1px solid #2d3748' }}>{c3}</td>
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
