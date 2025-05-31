import {createContext, useState, PropsWithChildren, useContext, useEffect} from 'react';

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
    setCurrRound: (currRound: number) => {},
    players: [] as string[],
    setPlayers: (players: string[]) => {}
});

const getInitialState = () => {
    const title = localStorage.getItem('title') || 'Game 1';
    const gameType = localStorage.getItem('gameType') as GameType || GameType.ProgressiveRook;
    const currRound = parseInt(localStorage.getItem('currRound') || '1', 10);
    const players = JSON.parse(localStorage.getItem('players') || '[]');

    return {
        title,
        gameType,
        currRound,
        players
    };
}

const GameContextProvider = (props: PropsWithChildren<{}>) => {
    const [title, setTitle] = useState(getInitialState().title);
    const [gameType, setGameType] = useState<GameType>(getInitialState().gameType); // Default to Progressive Rook
    const [currRound, setCurrRound] = useState(getInitialState().currRound);
    const [players, setPlayers] = useState<string[]>(getInitialState().players);

    useEffect(() => {
        localStorage.setItem('title', title);
        localStorage.setItem('gameType', gameType);
        localStorage.setItem('currRound', currRound.toString());
        localStorage.setItem('players', JSON.stringify(players));
    }
    , [title, gameType, currRound, players]);

    return (
        <GameContext.Provider value={{
            gameType,
            setGameType,
            title,
            setTitle,
            currRound,
            setCurrRound,
            players,
            setPlayers
        }}>
            {props.children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => useContext(GameContext);
export default GameContextProvider;