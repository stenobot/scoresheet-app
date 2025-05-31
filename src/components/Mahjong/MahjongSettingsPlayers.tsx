import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PrimaryButton from '../PrimaryButton';

function MahjongSettingsPlayers() {

  return (
    <div className="App">
      <header className="App-header">
        <div 
          style={{
            position: 'absolute', 
            top: '50%', left: '50%', 
            msTransform: 'translate(-50%, -50%)', 
            transform: 'translate(-50%, -50%)' }}>
          <div style={{ marginBottom: '20px' }}>
            <label>
              <h2>
                Mahjong - coming soon
              </h2>
            </label>
          </div>
        </div>
      </header>
    </div>
  );
}

export default MahjongSettingsPlayers;