import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import PrimaryButton from '../PrimaryButton';
import { useGameContext, gameTypes } from '../../contexts/GameContext';
import { useProgSettingsContext } from '../../contexts/ProgSettingsContext';

function ProgScoresheet() { 
  const { currentGame, setCurrentGame } = useGameContext();

  const { 
    showRowNums, 
    setShowRowNums,
    startingRowNum, 
    showColTotals,
    setShowColTotals,
    showGameTitle,
    setShowGameTitle,
    showRoundDescription,
    setShowRoundDescription,
    showRowLabels,
    setShowRowLabels } = useProgSettingsContext();

  const navigate = useNavigate();

  // We need an extra column for either row number or row labels
  const showLabelColumn = showRowNums || showRowLabels;

  // initial column totals values to set below arrays
  const initialColTotals = Array.from(currentGame.players.keys()).map( () => 0);

  // create array of column totals for the footer
  const [footerValues, setFooterValues] = useState(
    // if show row numbers is selected, add extra blank "" element for row number label column 
    // to beginning of initial array to ensure that array.map to UI works correctly.
    // this variable extra element also needs to be accounted for when array is updated
    showLabelColumn ? ["", ...initialColTotals] : initialColTotals);

  const didMountRef = useRef(false);
  const rowNumRef = useRef(0);
  const rowNumDoubleTwelveRuleAppliedRef = useRef(false);

  const roundDescriptions = [
    ['2 Sets', 'SS'],
    ['1 Run, 1 Set', 'RS'],
    ['2 Runs', 'RR'],
    ['3 Sets', 'SSS'],
    ['1 Run, 2 Sets', 'RSS'],
    ['2 Runs, 1 Set', 'RRS'],
    ['3 Runs', 'RRR'],
    ['4 Sets', 'SSSS'],
    ['1 Run, 3 Sets', 'RSSS'],
    ['2 Runs, 2 Sets', 'RRSS'],
    ['3 Runs, 1 Set', 'RRRS']
  ];

  /// <summary>
  ///   Adds a new row and other functions when Next Round button is clicked.
  /// </summary>
  const handleNextRoundClicked = () => {
    const newRound = currentGame.currRound + 1;
    const newDealer = currentGame.players[currentGame.currRound % currentGame.players.length];
    
    // Create a new scores array with an additional empty array for the new round
    const newScores = currentGame.scores.map(playerScores => [...playerScores, 0]);

    setCurrentGame({
      ...currentGame,
      currRound: newRound,
      currDealer: newDealer,
      scores: newScores
    });

    addTableRow(newRound - 1);
    const dealerIndex = currentGame.players.indexOf(newDealer);
    highlightCurrentRoundRow(newRound);
    highlightDealerColumn(dealerIndex);

    // Convert zeros to dashes in the second to last row
    convertZerosToDashesInLastRoundRow();
  }

  /// <summary>
  ///   Converts any cell with innerHTML value of "0" to "-" in the second to last row.
  ///   This function should be called after adding a new row to convert zeros in the previous row.
  /// </summary>
  const convertZerosToDashesInLastRoundRow = () => {
    const tBody = document.getElementById('tbody');
    const tRows = tBody?.getElementsByTagName('tr');
    
    if (tRows && tRows.length > 1) {
      // Get the second to last row (index is length - 2)
      const secondToLastRowIndex = tRows.length - 2;
      const secondToLastRow = tRows[secondToLastRowIndex];
      const cells = secondToLastRow.getElementsByTagName('td');
      
      if (cells) {
        // Loop through cells in the second to last row
        const playerOffset = showLabelColumn ? 1 : 0;
        for (let j = playerOffset; j < cells.length; j++) {
          const td = cells[j];
          
          // Check if the cell contains "0" and convert it to "-"
          if (td.innerHTML === '0') {
            td.innerHTML = '-';
          }
        }
      }
    }
  }

  /// <summary>
  ///   End the game by freezing the input cells, declaring the winner, and hiding this button
  /// </summary>
  const handleEndGameClicked = () => {
    setCurrentGame({
      ...currentGame,
      isGameOver: true,
    });

    // Feed index that is way out of bounds to remove all highlighting
    highlightCurrentRoundRow(99);
    highlightDealerColumn(99);

    // TODO: calculate and set current leader based on scores
  }

  /// <summary>
  ///   Handler that fires each time a cell is changed.
  ///   Finds all of the cells in the html table body, then updates the 2d array 
  ///   with the value of each cell.
  /// </summary>
  const handleCellChanged = () => {
    const tBody = document.getElementById('tbody');
    const tRows = tBody?.getElementsByTagName('tr');
    if (tRows && tRows.length > 0) {
      const newScores: string[][] = Array.from({ length: currentGame.players.length }, () => []);

      // Loop through rows
      for (let i = 0; i < tRows.length; i++) {
        const row = tRows[i];
        const cells = row.getElementsByTagName('td');
        if (cells) {
          // Loop through cells
          const playerOffset = showLabelColumn ? 1 : 0;
          for (let j = playerOffset; j < cells.length; j++) {
            const td = cells[j];
            const playerIndex = j - playerOffset;

            // Cell's value is a number or a dash, use normal cell styling
            if (Number.isInteger(Number(td.innerHTML)) || td.innerHTML === '-') {
              td.classList.add('normal-cell');
              td.classList.remove('normal-cell-bad-input');
              const cellValue = td.innerHTML as string;
              newScores[playerIndex][i] = cellValue;
            }
            else {
              // Cell's value is not a number or dash, set bad input styling
              td.classList.add('normal-cell-bad-input');
              td.classList.remove('normal-cell');
            }
          }
        }
      }

      setCurrentGame({
        ...currentGame,
        scores: newScores
      });
    }
  }

  const highlightDealerColumn = (dealerIndex: number) => { 
    if (dealerIndex !== -1) {
      // Get all table header cells
      const headerTableRow = document.getElementById('theadtrow');
      const headerCells = headerTableRow?.getElementsByTagName('th');

      // Get all table rows
      const tBody = document.getElementById('tbody');
      const tRows = tBody?.getElementsByTagName('tr');
      
      // Set highlight on dealer column in header
      if (headerCells) {
        for (let i = 0; i < headerCells.length; i++) {
          headerCells[i].classList.remove('dealer-column-highlight');
        }
        headerCells[dealerIndex + (showLabelColumn ? 1 : 0)].classList.add('dealer-column-highlight');
      }

      // Set highlight on dealer column in body
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
          
          if (cells[dealerIndex + (showLabelColumn ? 1 : 0)]) { // +1 when first cell is row number label
            cells[dealerIndex + (showLabelColumn ? 1 : 0)].classList.add('dealer-column-highlight');
          }
        }
      }
    }
  }

  const highlightCurrentRoundRow = (roundNumber: number) => {
    const tBody = document.getElementById('tbody');
    const tRows = tBody?.getElementsByTagName('tr');
    if (tRows) {
      // Clear existing highlights from all cells in all rows
      for (let i = 0; i < tRows.length; i++) {
        const cells = tRows[i].getElementsByTagName('td');
        for (let j = 0; j < cells.length; j++) {
          cells[j].classList.remove('current-round-highlight');
        }
      }

      // Highlight cells in the current round's row
      const rowIndex = roundNumber - 1;
      if (rowIndex >= 0 && rowIndex < tRows.length) {
        const cellsToHighlight = tRows[rowIndex].getElementsByTagName('td');
        const startIndex = showLabelColumn ? 1 : 0;
        for (let j = startIndex; j < cellsToHighlight.length; j++) {
          cellsToHighlight[j].classList.add('current-round-highlight');
        }
      }
    }
  }

  /// <summary>
  ///   Adds a new row with editable cells to the table.
  /// </summary>
  const addTableRow = (roundIndex?: number) => {
    //console.log(`addTableRow start - rowsValues.length: ${rowsValues.length}`);
    const tBody = document.getElementById('tbody');
    const trBody = document.createElement('tr');
    for (let i = 0; i < currentGame.players.length + 1; i++) {
      if (i === 0) {
        // add row number and description label first, if either option is selected
        if (showLabelColumn) {
          const currRowNum = startingRowNum + rowNumRef.current;
          const td = document.createElement('td');
          if (roundIndex !== undefined) {
            td.innerHTML = 
              `${showRowNums ? currRowNum : ""} 
              <span class="round-description">${showRowLabels ? roundDescriptions[roundIndex][1] : ""}</span>`;
          }
          else {
            td.innerHTML = `${currRowNum}`;
          }

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
        const playerIndex = showLabelColumn ? i - 1 : i;
        const score = (roundIndex !== undefined && currentGame.scores[playerIndex] && currentGame.scores[playerIndex][roundIndex] !== undefined)
          ? currentGame.scores[playerIndex][roundIndex]
          : 0;
        td.innerHTML = `${score}`;
        // show numeric keyboard on mobile
        td.inputMode = 'numeric';
        td.spellcheck = false;
        td.className = 'normal-cell';
        // when cell is clicked, auto-select it's contents
        td.onclick = () => selectElementContents(td);
        trBody.appendChild(td);
      }
    }
    tBody?.appendChild(trBody);
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
    if (currentGame.scores && currentGame.scores.length > 0) {
      const columnTotals = currentGame.scores.map(playerScores =>
        playerScores.reduce((sum: number, current) => sum + (isNaN(Number(current)) ? 0 : Number(current)), 0)
      );

      if (showLabelColumn) {
        setFooterValues(['', ...columnTotals]);
      } else {
        setFooterValues(columnTotals);
      }
    }

    if (currentGame.settings) {
      const settings = JSON.parse(currentGame.settings);
      if (settings.showRowNums !== undefined) setShowRowNums(settings.showRowNums);
      if (settings.showColTotals !== undefined) setShowColTotals(settings.showColTotals);
      if (settings.showGameTitle !== undefined) setShowGameTitle(settings.showGameTitle);
      if (settings.showRoundDescription !== undefined) setShowRoundDescription(settings.showRoundDescription);
      if (settings.showRowLabels !== undefined) setShowRowLabels(settings.showRowLabels);
    }
  }, [currentGame.scores, currentGame.settings, showLabelColumn]);

  useEffect(() => {
    if (didMountRef.current === false) {
      // only fire once when page loads
      const tBody = document.getElementById('tbody');
      if (tBody) {
        tBody.innerHTML = '';
      }
      
      for (let i = 0; i < currentGame.currRound; i++) {
        addTableRow(i);
      }

      makeHeaderCellsAutoSelect();
      const dealerIndex = currentGame.players.indexOf(currentGame.currDealer);
      highlightCurrentRoundRow(currentGame.currRound);
      highlightDealerColumn(dealerIndex);
      console.log(`useEffect - didMountRef.current: ${didMountRef.current}`);
      didMountRef.current = true;
    }
  });

  return (
    <div className="container">
      <table
        className={ showLabelColumn ? 'table-with-row-nums' : 'table-no-row-nums' }>
        <caption>
          {showGameTitle && <h2 style={{marginLeft: showColTotals ? 22 : 0}} className='table-title'>{currentGame.title}</h2>}
          <h6 style={{marginLeft: showColTotals ? 22 : 0}} className='table-subtitle'>
            {currentGame.isGameOver ?
              <div>{currentGame.currLeader} is the winner!</div> : 
              showRoundDescription && <div>{roundDescriptions[currentGame.currRound - 1][0]}</div>
            }
          </h6>
        </caption>
        <thead style={{ padding: '5px' }}>
          <tr id="theadtrow">
            { showLabelColumn === false ? 
                Array.from(currentGame.players.keys()).map( i => 
                  <th 
                    contentEditable 
                    suppressContentEditableWarning={true} 
                    spellCheck={false} key={i} 
                    className={getTableHeaderClass()}>{currentGame.players[i]}
                  </th>
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
              {showLabelColumn === false ? 
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
      <div style={{marginLeft: showColTotals ? 22 : 0}}>
        { currentGame.isGameOver ?
          <div className='table-subtitle'>The game has ended</div> :
            currentGame.currRound == 11 ? 
              <div style={{ marginTop: '0.7em' }}>
                <PrimaryButton onClick={handleEndGameClicked}>
                  End Game
                </PrimaryButton>
              </div> : 
              <div style={{ marginTop: '0.7em' }}>
                <PrimaryButton onClick={handleNextRoundClicked}>
                  Next Round
                </PrimaryButton>
              </div>
        }
        <label>
          <div style={{marginTop: 10}}>
            <a className='link' onClick={handleHomeClick}>Home</a>
          </div>
        </label>
      </div>
    </div>
  );
}
export default ProgScoresheet;