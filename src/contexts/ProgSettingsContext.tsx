import {createContext, useState, PropsWithChildren, useContext} from 'react';

const ProgSettingsContext = createContext({
    showRowNums: false,
    setShowRowNums: (showRowNums: boolean) => {},
    startingRowNum: 0,
    setStartingRowNum: (startingRowNum: number) => {},
    showColTotals: false,
    setShowColTotals: (showColTotals: boolean) => {},
});

const ProgSettingsContextProvider = (props: PropsWithChildren<{}>) => {
    const [showRowNums, setShowRowNums] = useState(true);
    const [startingRowNum, setStartingRowNum] = useState(6);
    const [showColTotals, setShowColTotals] = useState(true);

    return (
        <ProgSettingsContext.Provider value={{
            showRowNums,
            setShowRowNums,
            startingRowNum,
            setStartingRowNum,
            showColTotals,
            setShowColTotals
        }}>
            {props.children}
        </ProgSettingsContext.Provider>
    );
};

export const useProgSettingsContext = () => useContext(ProgSettingsContext);
export default ProgSettingsContextProvider;