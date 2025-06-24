import {createContext, useState, PropsWithChildren, useContext} from 'react';

export interface ProgSettings {
  showRowNums: boolean;
  startingRowNum: number;
  showColTotals: boolean;
}

const SimpleSettingsContext = createContext({
    showRowNums: false,
    setShowRowNums: (showRowNums: boolean) => {},
    startingRowNum: 0,
    setStartingRowNum: (startingRowNum: number) => {},
    showColTotals: false,
    setShowColTotals: (showColTotals: boolean) => {},
});

const SimpleSettingsContextProvider = (props: PropsWithChildren<{}>) => {
    const [showRowNums, setShowRowNums] = useState(true);
    const [startingRowNum, setStartingRowNum] = useState(1);
    const [showColTotals, setShowColTotals] = useState(true);

    return (
        <SimpleSettingsContext.Provider value={{
            showRowNums,
            setShowRowNums,
            startingRowNum,
            setStartingRowNum,
            showColTotals,
            setShowColTotals
        }}>
            {props.children}
        </SimpleSettingsContext.Provider>
    );
};

export const useSimpleSettingsContext = () => useContext(SimpleSettingsContext);
export default SimpleSettingsContextProvider;