import { useNavigate } from 'react-router-dom';

function LoonyRules() {
  const navigate = useNavigate();

  return (
    <div className='container' style={{ maxWidth: '480px', margin: '0 auto' }}>
      <h1 className='title'>Loony Rules</h1>
      <p style={{ fontSize: '18px', opacity: 0.7 }}>Rules coming soon.</p>
      <div style={{ marginTop: '32px' }}>
        <button className='link' onClick={() => navigate('/')}>Home</button>
      </div>
    </div>
  );
}

export default LoonyRules;
