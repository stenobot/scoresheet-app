import {createContext, useState, PropsWithChildren, useContext} from 'react';

const MahjongSettingsContext = createContext({
    startingPlayerScore: 0,
    setStartingPlayerScore: (startingRowNum: number) => {},
    limitValue: 0,
    setLimitValue: (limitValue: number) => {},
    baseWinScore: 0,
    setBaseWinScore: (baseWinScore: number) => {},
    reignOfTerror: 0,
    setReignOfTerror: (reignOfTerror: number) => {}
});

const MahjongSettingsContextProvider = (props: PropsWithChildren<{}>) => {
    const [startingPlayerScore, setStartingPlayerScore] = useState(2000);
    const [limitValue, setLimitValue] = useState(500);
    const [baseWinScore, setBaseWinScore] = useState(20);
    const [reignOfTerror, setReignOfTerror] = useState(8);

    return (
        <MahjongSettingsContext.Provider value={{
            startingPlayerScore,
            setStartingPlayerScore,
            limitValue,
            setLimitValue,
            baseWinScore,
            setBaseWinScore,
            reignOfTerror,
            setReignOfTerror
        }}>
            {props.children}
        </MahjongSettingsContext.Provider>
    );
};

export const useMahjongSettingsContext = () => useContext(MahjongSettingsContext);
export default MahjongSettingsContextProvider;