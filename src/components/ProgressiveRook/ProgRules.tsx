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
    body: 'Progressive Rook is a Rummy-style game for 3-5 players using a 57-card Rook deck. It is played over 15 rounds.',
  },
  {
    heading: 'Rules coming soon...',
    body: 'Rules coming soon...',
    items: [
      'Rules coming soon',
      'Rules coming soon',
      'Rules coming soon',
    ],
    table: {
      col1: 'Rules coming soon',
      col2: 'Rules coming soon',
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
