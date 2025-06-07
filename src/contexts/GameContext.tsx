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
    setPlayers: (players: string[]) => {},
    currDealer: '',
    setCurrDealer: (currDealer: string) => {}
});

const getInitialState = () => {
    const gameType = localStorage.getItem('gameType') as GameType || GameType.ProgressiveRook;
    const title = localStorage.getItem('title') || 'Game 1';
    const currRound = parseInt(localStorage.getItem('currRound') || '1', 10);
    const players = JSON.parse(localStorage.getItem('players') || '["P1", "P2", "P3", "P4"]') as string[];
    const currDealer = localStorage.getItem('currDealer') || 'P1';

    return {
        title,
        gameType,
        currRound,
        players,
        currDealer
    };
}

const GameContextProvider = (props: PropsWithChildren<{}>) => {
    const [title, setTitle] = useState(getInitialState().title);
    const [gameType, setGameType] = useState<GameType>(getInitialState().gameType);
    const [currRound, setCurrRound] = useState(getInitialState().currRound);
    const [players, setPlayers] = useState<string[]>(getInitialState().players);
    const [currDealer, setCurrDealer] = useState(getInitialState().currDealer);

    useEffect(() => {
        // Save the current state to localStorage whenever it changes
        localStorage.setItem('gameType', gameType);
        localStorage.setItem('title', title);
        localStorage.setItem('currRound', currRound.toString());
        localStorage.setItem('players', JSON.stringify(players));
        localStorage.setItem('currDealer', currDealer);
    }
    , [title, gameType, currRound, players, currDealer]);

    return (
        <GameContext.Provider value={{
            gameType,
            setGameType,
            title,
            setTitle,
            currRound,
            setCurrRound,
            players,
            setPlayers,
            currDealer,
            setCurrDealer
        }}>
            {props.children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => useContext(GameContext);
export default GameContextProvider;