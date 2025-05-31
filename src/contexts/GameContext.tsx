import {createContext, useState, PropsWithChildren, useContext} from 'react';

enum GameType {
  Simple = 'Simple Scoresheet',
  ProgressiveRook = 'Progressive Rook',
  Mahjong = 'Mahjong (1960s)'
};

export const gameTypes = Object.values(GameType);

const GameContext = createContext({
    gameType: GameType.Simple,
    setGameType: (gameType: GameType) => {},
    title: '',
    setTitle: (title: string) => {}
});

const GameContextProvider = (props: PropsWithChildren<{}>) => {
    const [title, setTitle] = useState('Game 1');
    const [gameType, setGameType] = useState<GameType>(GameType.ProgressiveRook); // Default to Progressive Rook
    return (
        <GameContext.Provider value={{
            gameType,
            setGameType,
            title,
            setTitle
        }}>
            {props.children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => useContext(GameContext);
export default GameContextProvider;