import {createContext, useState, PropsWithChildren, useContext} from 'react';

export enum EndCondition {
  ScoreReached = 'Score Reached',
  RoundReached = 'Round Reached'
};

export const endConditions = Object.values(EndCondition);

export enum WinCondition {
  HighestScore = 'Highest Score',
  LowestScore = 'Lowest Score'
};

export const winConditions = Object.values(WinCondition);

export interface ProgSettings {
  showRowNums: boolean;
  startingRowNum: number;
  showColTotals: boolean;
  endCondition: EndCondition;
  winCondition: WinCondition;
  winningScore: number;
  finalRound: number;
}

const BasicSettingsContext = createContext({
    showRowNums: false,
    setShowRowNums: (showRowNums: boolean) => {},
    startingRowNum: 0,
    setStartingRowNum: (startingRowNum: number) => {},
    showColTotals: false,
    setShowColTotals: (showColTotals: boolean) => {},
    endCondition: EndCondition.ScoreReached,
    setEndCondition: (endCondition: EndCondition) => {},
    winCondition: WinCondition.HighestScore,
    setWinCondition: (winCondition: WinCondition) => {},
    winningScore: 0,
    setWinningScore: (winningScore: number) => {},
    finalRound: 0,
    setFinalRound: (finalRound: number) => {}
});

const BasicSettingsContextProvider = (props: PropsWithChildren<{}>) => {
    const [showRowNums, setShowRowNums] = useState(true);
    const [startingRowNum, setStartingRowNum] = useState(1);
    const [showColTotals, setShowColTotals] = useState(true);
    const [endCondition, setEndCondition] = useState(EndCondition.ScoreReached);
    const [winCondition, setWinCondition] = useState(WinCondition.HighestScore);
    const [winningScore, setWinningScore] = useState(50);
    const [finalRound, setFinalRound] = useState(12);

    return (
        <BasicSettingsContext.Provider value={{
            showRowNums,
            setShowRowNums,
            startingRowNum,
            setStartingRowNum,
            showColTotals,
            setShowColTotals,
            endCondition,
            setEndCondition,
            winCondition,
            setWinCondition,
            winningScore,
            setWinningScore,
            finalRound,
            setFinalRound
        }}>
            {props.children}
        </BasicSettingsContext.Provider>
    );
};

export const useBasicSettingsContext = () => useContext(BasicSettingsContext);
export default BasicSettingsContextProvider;