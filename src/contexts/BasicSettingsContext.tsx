import {createContext, useState, PropsWithChildren, useContext} from 'react';

export interface ProgSettings {
  showRowNums: boolean;
  startingRowNum: number;
  showColTotals: boolean;
  winningScore: number;
}

const BasicSettingsContext = createContext({
    showRowNums: false,
    setShowRowNums: (showRowNums: boolean) => {},
    startingRowNum: 0,
    setStartingRowNum: (startingRowNum: number) => {},
    showColTotals: false,
    setShowColTotals: (showColTotals: boolean) => {},
    winningScore: 0,
    setWinningScore: (winningScore: number) => {},
});

const BasicSettingsContextProvider = (props: PropsWithChildren<{}>) => {
    const [showRowNums, setShowRowNums] = useState(true);
    const [startingRowNum, setStartingRowNum] = useState(1);
    const [showColTotals, setShowColTotals] = useState(true);
    const [winningScore, setWinningScore] = useState(50);

    return (
        <BasicSettingsContext.Provider value={{
            showRowNums,
            setShowRowNums,
            startingRowNum,
            setStartingRowNum,
            showColTotals,
            setShowColTotals,
            winningScore,
            setWinningScore
        }}>
            {props.children}
        </BasicSettingsContext.Provider>
    );
};

export const useBasicSettingsContext = () => useContext(BasicSettingsContext);
export default BasicSettingsContextProvider;