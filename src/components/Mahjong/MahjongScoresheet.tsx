import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MahjongScoresheet() {
  const navigate = useNavigate();
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
                MAHJONG SCORESHEET - COMING SOON
              </h2>
            </label>
          </div>
        </div>
      </header>
    </div>
  );
}

export default MahjongScoresheet;