import { useEffect, useRef, useState } from 'react';
import PrimaryButton from '../PrimaryButton';
import { useGameContext, gameTypes } from '../../contexts/GameContext';
import { useProgContext } from '../../contexts/ProgContext';

function ProgScoresheet() { 
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

  // initial column totals values to set below arrays
  const initialColTotals = Array.from(Array(colNum).keys()).map( i => 0);
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
  ///   Adds a new row when the Add Row button is clicked.
  /// </summary>
  const handleAddRowClick = () => {
    // console.log(`handleAddRowClick - rowsValues.length: ${rowsValues.length}`)
    addTableRow();
  }

  /// <summary>
  ///   Handler that fires each time a cell is changed.
  ///   Finds all of the cells in the html table body, then updates the 2d array 
  ///   with the value of each cell.
  /// </summary>
  const handleCellChanged = () => {
    console.log(`handleCellChanged Start - rowsValues.length: ${rowsValues.length}`);

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
              td.className = 'normalCell';
              const  cellValue = Number(td.innerHTML);
              // ...and it's different from corresponding 2d array value...
              if (cellValue !== rowsValues[i][j]) {
                // ...update 2d array with current cell value
                rowsValues[i][j] = cellValue;
              }
            }
            else {
              // cell's value is not a number
              td.className = 'normalCellBadInput';
            }
          }
        }
      }
    }
    console.log(`handleCellChanged End - rowsValues.length: ${rowsValues.length}`);
    const nextFooterValues = sumColumnsArray(rowsValues);
    setFooterValues(nextFooterValues);
  }

  /// <summary>
  ///   Deletes a row when it's double-clicked.
  ///  (Not currently used.)
  /// </summary>
  /// <param name="e">Event</param>
  const handleTableDoubleClick = (e: React.MouseEvent<HTMLTableElement, MouseEvent>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'TD') {
      const parent = target.parentElement as HTMLElement;
      parent.remove();
    }
  }

  /// <summary>
  ///   Adds a new row with editable cells to the table.
  /// </summary>
  const addTableRow = () => {
    console.log(`addTableRow start - rowsValues.length: ${rowsValues.length}`);
    const tBody = document.getElementById('tbody');
    const trBody = document.createElement('tr');
    for (let i = 0; i < colNum + 1; i++) {
      if (i === 0) {
        // add row number label first, if option selected
        if (showRowNums) {
          const currRowNum = startingRowNum + rowNumRef.current;
          const td = document.createElement('td');
          td.innerHTML = `${currRowNum}`;

          // special rule for Progressive Rook preset,
          // where row 12 is doubled
          if (gameType === gameTypes[1] && 
            currRowNum === 12 &&
            rowNumDoubleTwelveRuleAppliedRef.current === false) {
            rowNumDoubleTwelveRuleAppliedRef.current = true;
          }
          else {
            rowNumRef.current++;
          }

          td.className = 'numLabelCell';
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
    console.log(`addTableRow end - rowsValues.length: ${rowsValues.length}`);
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

  useEffect(() => {
    if (didMountRef.current === false) {
      // only fire once when page loads
      addTableRow();
      makeHeaderCellsAutoSelect();
      didMountRef.current = true;
    }
  });  

  return (
    <div className="App">
      <header className="App-header">
        <table
          className={ showRowNums ? 'tableWithRowNums' : 'tableNoRowNums' }>
          <caption>
            <h2 className={ showRowNums ? 'titleWithRowNums' : 'titleNoRowNums' }>{title}</h2>
          </caption>
          <thead style={{ padding: '5px' }}>
            <tr id="theadtrow">
              { showRowNums === false ? 
                  Array.from(Array(colNum).keys()).map( i => 
                    <th contentEditable suppressContentEditableWarning={true} key={i} className='normalCellHeader'>P{i + 1}</th>
                  ) : 
                  Array.from(Array(colNum + 1).keys()).map( i => {
                    return i === 0 ?
                      <th className='numLabelCellHeader' key={i}></th>
                      : <th className='normalCellHeader' contentEditable  suppressContentEditableWarning={true} key={i}>P{i}</th>}
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
                    <th key={i} className='normalCellFooter'>{footerValue}</th>
                  ) : 
                  footerValues.map( (footerValue, i) => {
                    return i === 0 ?
                      <th className='numLabelCellHeader' key={i}></th>
                      : <th className='normalCellFooter' key={i}>{footerValue}</th>}
                  )
                }
              </tr>
            </tfoot>
          }
        </table>
        <div style={{ marginTop: '0.7em' }}>
          <PrimaryButton onClick={handleAddRowClick}>
            Add Row
          </PrimaryButton>
        </div>
        {/* <p style={{ color: '#70aacb', fontSize: '20px'}}>(<kbd>Double-click</kbd> row to delete)</p> */}
      </header>
    </div>
  );
}
export default ProgScoresheet;