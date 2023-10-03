import { useNavigate } from 'react-router-dom';
import PrimaryButton from './PrimaryButton';

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
          <PrimaryButton onClick={handleNewClick}>
            New Scoresheet
          </PrimaryButton>
        </div>
      </header>
    </div>
  );
}

export default Start;