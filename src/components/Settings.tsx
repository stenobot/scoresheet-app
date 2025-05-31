import { Dispatch, SetStateAction, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PrimaryButton from './PrimaryButton';
import { Preset } from '../App';
import { useGameContext } from '../contexts/GameContext';

function Settings(props: {
  colNum: number,
  setColNum: Dispatch<SetStateAction<number>>,
  showRowNums: boolean, 
  setShowRowNums: Dispatch<SetStateAction<boolean>>,
  startingRowNum: number,
  setStartingRowNum: Dispatch<SetStateAction<number>>,
  showColTotals: boolean,
  setShowColTotals: Dispatch<SetStateAction<boolean>>,
  presets: string[],
  setCurrPreset: Dispatch<SetStateAction<Preset>> }) {

  const { title, setTitle } = useGameContext();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("url changed")
  }, [location]);

  const handleNextClick = () => {
    console.log(`colTotal: ${props.colNum}`);
    navigate('/scoresheet');
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    switch (e.target.value) {
      case Preset.ProgressiveRook:
        props.setCurrPreset(Preset.ProgressiveRook);
        // special rules
        props.setStartingRowNum(6);
        props.setShowRowNums(true);
        props.setShowColTotals(true);
        break;
      case Preset.None:
        default:
        props.setCurrPreset(Preset.None);
        // no special rules
        break;
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div 
          style={{
            position: 'absolute', 
            top: '50%', left: '50%', 
            msTransform: 'translate(-50%, -50%)', 
            transform: 'translate(-50%, -50%)' }}>
          <label>
            <input 
              name="titleInput" 
              defaultValue={title}
              onClick={e => e.currentTarget.select()}
              onChange={e => setTitle(e.target.value)} />
          </label>
          <div style={{ marginTop: '20px'}}>
            <label>
              PRESET:
              <select 
                className='dropdown-select-presets'
                defaultValue={props.presets[0]}
                onChange={e => handlePresetChange(e)}>
                  {props.presets.map((i) => (
                    <option key={i}>
                      {i}
                    </option>
                    ))}
              </select>
            </label>
          </div>
          <div style={{ marginTop: '20px'}}>
            <label>
              <select 
                className='dropdown-select'
                value={props.colNum}
                onChange={e => props.setColNum(Number(e.target.value))}>
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
                checked={props.showColTotals}
                onChange={e => props.setShowColTotals(e.target.checked)}
                style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              SHOW COLUMN TOTALS
            </label>
          </div>
          <div style={{ marginTop: '20px' }}>
            <label>
              <input 
                className='checkbox-input' 
                type='checkbox' 
                checked={props.showRowNums}
                onChange={e => props.setShowRowNums(e.target.checked)}
                style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              SHOW ROW NUMBERS
            </label>
          </div>
          { props.showRowNums &&
            <div style={{ marginTop: '20px' }}>
              <label>
                <select 
                  className='dropdown-select' 
                  value={props.startingRowNum} 
                  onChange={e => props.setStartingRowNum(Number(e.target.value))}>
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

export default Settings;