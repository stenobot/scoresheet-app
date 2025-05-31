import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PrimaryButton from '../PrimaryButton';
import { gameTypes, useGameContext } from '../../contexts/GameContext';
import { useProgContext } from '../../contexts/ProgContext';

function ProgSettings() {
  const { gameType, title } = useGameContext();
  const { 
    colNum, 
    setColNum, 
    showRowNums, 
    setShowRowNums, 
    startingRowNum, 
    setStartingRowNum, 
    showColTotals, 
    setShowColTotals } = useProgContext();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("url changed")
  }, [location]);

  const handleNextClick = () => {
    console.log(`colTotal: ${colNum}`);

    if (gameType === gameTypes[0]) {
      setStartingRowNum(1);
    }
    navigate('/prog-scoresheet');
  };

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
                {gameType} Settings ({title})
              </h2>
            </label>
          </div>
          <div style={{ marginTop: '20px'}}>
            <label>
              <select 
                className='dropdown-select'
                value={colNum}
                onChange={e => setColNum(Number(e.target.value))}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              # OF PLAYERS
            </label>
          </div>
          <div style={{ marginTop: '20px' }}>
            <label>
              <input 
                className='checkbox-input' 
                type='checkbox' 
                checked={showColTotals}
                onChange={e => setShowColTotals(e.target.checked)}
                style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              SHOW COLUMN TOTALS
            </label>
          </div>
          <div style={{ marginTop: '20px' }}>
            <label>
              <input 
                className='checkbox-input' 
                type='checkbox' 
                checked={showRowNums}
                onChange={e => setShowRowNums(e.target.checked)}
                style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              SHOW ROW NUMBERS
            </label>
          </div>
          { showRowNums && gameType === gameTypes[1] &&
            <div style={{ marginTop: '20px' }}>
              <label>
                <select 
                  className='dropdown-select' 
                  value={startingRowNum}
                  onChange={e => setStartingRowNum(Number(e.target.value))}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </select>
                STARTING ROW NUMBER
              </label>
            </div>
          }
          <div style={{ marginTop: '20px' }}>
            <PrimaryButton onClick={handleNextClick}>
              Next
            </PrimaryButton>
          </div>
        </div>
      </header>
    </div>
  );
}

export default ProgSettings;