import {createContext, useState, PropsWithChildren, useContext} from 'react';

const ProgContext = createContext({
    showRowNums: false,
    setShowRowNums: (showRowNums: boolean) => {},
    startingRowNum: 0,
    setStartingRowNum: (startingRowNum: number) => {},
    showColTotals: false,
    setShowColTotals: (showColTotals: boolean) => {},
});

const ProgContextProvider = (props: PropsWithChildren<{}>) => {
    const [showRowNums, setShowRowNums] = useState(true);
    const [startingRowNum, setStartingRowNum] = useState(6);
    const [showColTotals, setShowColTotals] = useState(true);

    return (
        <ProgContext.Provider value={{
            showRowNums,
            setShowRowNums,
            startingRowNum,
            setStartingRowNum,
            showColTotals,
            setShowColTotals
        }}>
            {props.children}
        </ProgContext.Provider>
    );
};

export const useProgContext = () => useContext(ProgContext);
export default ProgContextProvider;