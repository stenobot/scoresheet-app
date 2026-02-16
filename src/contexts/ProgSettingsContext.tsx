import {createContext, useState, PropsWithChildren, useContext} from 'react';

export interface ProgSettings {
  showRowNums: boolean;
  startingRowNum: number;
  showColTotals: boolean;
  showGameTitle: boolean;
  showRoundDescription: boolean;
  showRowLabels: boolean;
}

const ProgSettingsContext = createContext({
    showRowNums: false,
    setShowRowNums: (showRowNums: boolean) => {},
    startingRowNum: 0,
    showColTotals: false,
    setShowColTotals: (showColTotals: boolean) => {},
    showGameTitle: false,
    setShowGameTitle: (showGameTitle: boolean) => {},
    showRoundDescription: false,
    setShowRoundDescription: (showRoundDescription: boolean) => {},
    showRowLabels: false,
    setShowRowLabels: (showRowLabels: boolean) => {},
});

const ProgSettingsContextProvider = (props: PropsWithChildren<{}>) => {
    const [showRowNums, setShowRowNums] = useState(true);
    const [startingRowNum] = useState(6); // Prog always starts at row 6
    const [showColTotals, setShowColTotals] = useState(true);
    const [showGameTitle, setShowGameTitle] = useState(true);
    const [showRoundDescription, setShowRoundDescription] = useState(true);
    const [showRowLabels, setShowRowLabels] = useState(true);
    return (
        <ProgSettingsContext.Provider value={{
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
            setShowRowLabels
        }}>
            {props.children}
        </ProgSettingsContext.Provider>
    );
};

export const useProgSettingsContext = () => useContext(ProgSettingsContext);
export default ProgSettingsContextProvider;