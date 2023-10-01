import { useNavigate } from 'react-router-dom';

function Start() {
  const navigate = useNavigate();
  const handleNewClick = () => {
    navigate('/settings');
  } 

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ 
          margin: '0px', 
          position: 'absolute', 
          top: '50%', left: '50%', 
          msTransform: 'translate(-50%, -50%)', 
          transform: 'translate(-50%, -50%)' }}>
          <button onClick={handleNewClick}>
            New Scoresheet
          </button>
        </div>
      </header>
    </div>
  );
}

export default Start;