import {createContext, useState, PropsWithChildren, useContext} from 'react';

enum GameType {
  Simple = 'Simple Scoresheet',
  ProgressiveRook = 'Progressive Rook',
  Mahjong = 'Mahjong'
};

export const gameTypes = Object.values(GameType);

const GameContext = createContext({
    gameType: GameType.Simple,
    setGameType: (gameType: GameType) => {},
    title: '',
    setTitle: (title: string) => {},
    currRound: 0,
    setCurrRound: (currRound: number) => {}
});

const GameContextProvider = (props: PropsWithChildren<{}>) => {
    const [title, setTitle] = useState('Game 1');
    const [gameType, setGameType] = useState<GameType>(GameType.ProgressiveRook); // Default to Progressive Rook
    const [currRound, setCurrRound] = useState(1);
    return (
        <GameContext.Provider value={{
            gameType,
            setGameType,
            title,
            setTitle,
            currRound,
            setCurrRound
        }}>
            {props.children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => useContext(GameContext);
export default GameContextProvider;