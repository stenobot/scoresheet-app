import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import PrimaryButton from '../PrimaryButton';
import { useGameContext, gameTypes } from '../../contexts/GameContext';
import { useProgSettingsContext } from '../../contexts/ProgSettingsContext';

function ProgScoresheet() { 
  const { currentGame, setCurrentGame } = useGameContext();

  const { 
    showRowNums, 
    startingRowNum, 
    showColTotals } = useProgSettingsContext();

  const navigate = useNavigate();

  // initial column totals values to set below arrays
  const initialColTotals = Array.from(currentGame.players.keys()).map( () => 0);
  // create 2d array for all cell values, 
  // as a source of truth when we column totals
  const [rowsValues, setRowsValues] = useState([initialColTotals]);
  // create array of column totals for the footer
  const [footerValues, setFooterValues] = useState(
    // if show row numbers is selected, add extra blank "" element for row number label column 
    // to beginning of initial array to ensure that array.map to UI works correctly.
    // this variable extra element also needs to be accounted for when array is updated
    showRowNums ? ["", ...initialColTotals] : initialColTotals
  );

  const didMountRef = useRef(false);
  const rowNumRef = useRef(0);
  const rowNumDoubleTwelveRuleAppliedRef = useRef(false);

  /// <summary>
  ///   Adds a new row and other functions when Next Round button is clicked.
  /// </summary>
  const handleNextRoundClicked = () => {
        setCurrentGame({
      ...currentGame,
      currRound: currentGame.currRound + 1
    });
    const currDealer = currentGame.players[currentGame.currRound % currentGame.players.length];
    setCurrentGame({
      ...currentGame,
      currDealer: currDealer
    });
    console.log(`handleNextRoundClicked - players: ${currentGame.players}, currDealer: ${currDealer}`);
    addTableRow();
    handleCellChanged();
    const dealerIndex = currentGame.players.indexOf(currDealer);
    highlightDealerColumn(dealerIndex);
  }

  /// <summary>
  ///   Handler that fires each time a cell is changed.
  ///   Finds all of the cells in the html table body, then updates the 2d array 
  ///   with the value of each cell.
  /// </summary>
  const handleCellChanged = () => {
    const tBody = document.getElementById('tbody');
    const tRows = tBody?.getElementsByTagName('tr');
    if (tRows) {
      // loop through rows
      for (let i = 0; i < tRows.length; i++) {
        const row = tRows[i];
        const cells = row.getElementsByTagName('td');
        if (cells) {
          // loop through cells
          for (let j = 0; j < cells.length; j++) {
            const td = cells[j];
            // if cell's value is a number...
            if (Number.isInteger(Number(td.innerHTML))) {
              if (showRowNums && j === 0) {
                // cell is row number label, no-op
                continue;
              }
              td.className = 'normal-cell';
              const  cellValue = Number(td.innerHTML);
              // ...and it's different from corresponding 2d array value...
              if (rowsValues[i] && cellValue !== rowsValues[i][j]) {
                // ...update 2d array with current cell value
                rowsValues[i][j] = cellValue;
              }
            }
            else {
              // cell's value is not a number
              td.className = 'normal-cell-bad-input';
            }
          }
        }
      }
    }
    console.log(`handleCellChanged End - rowsValues.length: ${rowsValues.length}`);
    const nextFooterValues = sumColumnsArray(rowsValues);
    setFooterValues(nextFooterValues);
  }

  const highlightDealerColumn = (dealerIndex: number) => { 
    if (dealerIndex !== -1) {
      // Get all table rows
      const tBody = document.getElementById('tbody');
      const tRows = tBody?.getElementsByTagName('tr');
      if (tRows) {
        for (let i = 0; i < tRows.length; i++) {
          const row = tRows[i];
          const cells = row.getElementsByTagName('td');

          for (let j = 0; j < cells.length; j++)
          {
            if (cells[j]) {
              // Remove highlight from all cells in row
              cells[j].classList.remove('dealer-column-highlight');
            }
          }
          
          if (cells[dealerIndex + 1]) { // +1 because first cell is row number label
            // Add highlight to the dealer column cells
            cells[dealerIndex + 1].classList.add('dealer-column-highlight');
          }
        }
      }
    }
  }

  /// <summary>
  ///   Deletes a row when it's double-clicked.
  ///  (Not currently used.)
  /// </summary>
  /// <param name="e">Event</param>
  // const handleTableDoubleClick = (e: React.MouseEvent<HTMLTableElement, MouseEvent>) => {
  //   const target = e.target as HTMLElement;
  //   if (target.tagName === 'TD') {
  //     const parent = target.parentElement as HTMLElement;
  //     parent.remove();
  //     setCurrRound(currRound - 1);
  //   }
  // }

  /// <summary>
  ///   Adds a new row with editable cells to the table.
  /// </summary>
  const addTableRow = () => {
    //console.log(`addTableRow start - rowsValues.length: ${rowsValues.length}`);
    const tBody = document.getElementById('tbody');
    const trBody = document.createElement('tr');
    for (let i = 0; i < currentGame.players.length + 1; i++) {
      if (i === 0) {
        // add row number label first, if option selected
        if (showRowNums) {
          const currRowNum = startingRowNum + rowNumRef.current;
          const td = document.createElement('td');
          td.innerHTML = `${currRowNum}`;

          // special rule for Progressive Rook preset,
          // where row 12 is doubled
          if (currentGame.gameType === gameTypes[1] && 
            currRowNum === 12 &&
            rowNumDoubleTwelveRuleAppliedRef.current === false) {
            rowNumDoubleTwelveRuleAppliedRef.current = true;
          }
          else {
            rowNumRef.current++;
          }

          td.className = 'num-label-cell';
          td.onclick = () => selectElementContents(td);
          trBody.appendChild(td);
        }
      } else {
        // add additional, editable table cells
        const td = document.createElement('td');
        td.setAttribute('contenteditable', 'true');
        td.setAttribute('suppressContentEditableWarning', 'true');
        // default value is 0
        td.innerHTML = '0';
        // show numeric keyboard on mobile
        td.inputMode = 'numeric';
        td.spellcheck = false;
        td.className = 'normalCell';
        // when cell is clicked, auto-select it's contents
        td.onclick = () => selectElementContents(td);
        trBody.appendChild(td);
      }
    }
    tBody?.appendChild(trBody);

    // initialize new row in 2d array to zeros
    setRowsValues([...rowsValues, initialColTotals]);
  }

  /// <summary>
  ///   Selects all text in a given element.
  /// </summary>
  /// <param name="el">Element to select</param>
  const selectElementContents = (el: HTMLElement) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  /// <summary>
  ///   Changes the name of a player in the players array.
  /// </summary>
  /// <param name="name">New name for the player</param>
  /// <param name="index">Index of the player in the players array</param>
  const changeName = (name: string, index: number) => {
    // Update the players array with the new name
    const updatedPlayers = [...currentGame.players];
    if (index >= 0 && index < updatedPlayers.length) {
      updatedPlayers[index] = name;
      setCurrentGame({
        ...currentGame,
        players: updatedPlayers
      });
      setCurrentGame({
        ...currentGame,
        currDealer: updatedPlayers[0]
      });
    } else {
      console.error(`Index ${index} is out of bounds for players array.`);
    } 
  };

  /// <summary>
  ///   Handles input in a cell to limit the number of characters to 4.
  /// </summary>
  /// <param name="e">Event</param>
  const handleCellInput = (e: React.FormEvent<HTMLElement>) => {
    const maxChars = 4;
    const el = e.currentTarget;
    if (el.textContent && el.textContent.length > maxChars) {
      el.textContent = el.textContent.slice(0, maxChars);
      // Move cursor to end
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(el);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  /// <summary> 
  ///   Loops through a 2d array of numbers and sums the values in each column. 
  /// </summary>
  /// <param name="rowsValues">2d array of numbers</param>
  /// <returns>1D array of column totals</returns>
  const sumColumnsArray = (rowsValues: number[][]) => {
    const sumColumnsValues: number[] = [];
    console.log(`sumColumnsArray - rowsValues: ${rowsValues}`);
    console.log(`sumColumnsArray - rowsValues.length: ${rowsValues.length}`);
    rowsValues.map((row, i) => {
      if (i === 0) {
        // Workaround for weird bug where first row of 2d array gets added twice.
        // I think this has something to do with calling addTableRow in useEffect.
        // (addTableRow calls setRowValues, a useState setter, which definitely gets called 
        // again on or before handleCellChanged.)
        // To work around, we simply ignore the first row when calculating the sum. Ugly but works.
        return 0;
      }
      return row.map((num, j) => {
        if (sumColumnsValues[j]) {
            return sumColumnsValues[j] += num;
          } else {
            return sumColumnsValues[j] = num;
          }
       });
    });

    console.log(`sumColumnsArray - sumColumnsValues: ${sumColumnsValues}`);
    return sumColumnsValues;
 }

  /// <summary>
  ///  Find each header cell and make it's contents auto-select when clicked.
  ///  This must be done manually because React can't pass the event to the onClick handler.
  /// </summary>
  const makeHeaderCellsAutoSelect = () => {
    const headerTableRow = document.getElementById('theadtrow');
    const cells = headerTableRow?.getElementsByTagName('th');
    if (cells) {
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        if (cell) {
          // when cell is clicked, auto-select it's contents
          cell.onclick = () => selectElementContents(cell);
        }
      }
    }
  }

  const getTableHeaderClass = () => {
    switch (currentGame.players.length) {
      case 3:
        return 'normal-cell-header-3';
      case 5:
        return 'normal-cell-header-5';
      default:
        return 'normal-cell-header';
    }
  }

  const handleHomeClick = () => {
    navigate('/');
  }

  useEffect(() => {
    if (didMountRef.current === false) {
      // only fire once when page loads
      addTableRow();
      makeHeaderCellsAutoSelect();
      handleCellChanged();
      const dealerIndex = currentGame.players.indexOf(currentGame.currDealer);
      highlightDealerColumn(dealerIndex);
      console.log(`useEffect - didMountRef.current: ${didMountRef.current}`);
      didMountRef.current = true;
    }
  });  

  return (
    <div className="container">
      <table
        className={ showRowNums ? 'table-with-row-nums' : 'table-no-row-nums' }>
        <caption>
          <h2 className={ showRowNums ? 'title-with-row-nums' : 'title-no-row-nums' }>{currentGame.title}</h2>
          <h6 className={ showRowNums ? 'subtitle-with-row-nums' : 'subtitle-no-row-nums' }>Round {currentGame.currRound}</h6>
        </caption>
        <thead style={{ padding: '5px' }}>
          <tr id="theadtrow">
            { showRowNums === false ? 
                Array.from(currentGame.players.keys()).map( i => 
                  <th 
                  contentEditable 
                  suppressContentEditableWarning={true} 
                  spellCheck={false} key={i} 
                  className={getTableHeaderClass()}>{currentGame.players[i]}</th>
                ) : 
                Array.from(Array(currentGame.players.length + 1).keys()).map( i => {
                  return i === 0 ?
                    <th className='num-label-cell-header' key={i}></th>
                    : <th
                        className={getTableHeaderClass()}
                        contentEditable
                        onKeyUp={e => changeName((e.currentTarget.textContent ?? ''), i - 1)}
                        onInput={handleCellInput}
                        suppressContentEditableWarning={true}
                        spellCheck={false}
                        key={i}>{currentGame.players[i - 1]}</th>}
                )
            }
          </tr>
        </thead>
        <tbody id="tbody" onKeyUp={handleCellChanged}>
          <tr> 
          </tr>
        </tbody>
        {showColTotals === true &&
          <tfoot>
            <tr>
              {showRowNums === false ? 
                footerValues.map( (footerValue, i) => 
                  <th key={i} className='normal-cell-footer'>{footerValue}</th>
                ) : 
                footerValues.map( (footerValue, i) => {
                  return i === 0 ?
                    <th className='num-label-cell-header' key={i}></th>
                    : <th className='normal-cell-footer' key={i}>{footerValue}</th>}
                )
              }
            </tr>
          </tfoot>
        }
      </table>
      <div style={{ marginTop: '0.7em' }}>
        <PrimaryButton onClick={handleNextRoundClicked}>
          Next Round
        </PrimaryButton>
      </div>
      <label>
        <div style={{marginTop: 10}}>
          <a className='link' onClick={handleHomeClick}>Home</a>
        </div>
      </label>
      {/* <p style={{ color: '#70aacb', fontSize: '20px'}}>(<kbd>Double-click</kbd> row to delete)</p> */}
    </div>
  );
}
export default ProgScoresheet;