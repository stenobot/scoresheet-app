import {createContext, useState, PropsWithChildren, useContext, useEffect} from 'react';
import { isEmpty } from '../utils/Utils';
import { useLocation } from 'react-router-dom';

export enum GameType {
  Simple = 'Simple Scoresheet',
  ProgressiveRook = 'Progressive Rook',
  Mahjong = 'Mahjong'
};

export const gameTypes = Object.values(GameType);

export interface Game {
  id: string;
  title: string;
  gameType: GameType;
  currRound: number;
  players: string[];
  currDealer: string;
  currLeader: string;
  isGameOver: boolean;
  settings: string;
}

const getInitialState = () => {
  const gamesStr = localStorage.getItem('games');
  const games: Game[] = gamesStr ? JSON.parse(gamesStr) : [];
  
  // If no games exist, create initial game
  if (games.length === 0) {
    const initialGame: Game = {
      id: '',
      title: 'Game 1',
      gameType: GameType.ProgressiveRook,
      currRound: 1,
      players: ['P1', 'P2', 'P3', 'P4'],
      currDealer: 'P1',
      currLeader: 'P1',
      isGameOver: false,
      settings: ''
    };
    games.push(initialGame);

    return initialGame;
  }

  // Return most recent game
  return games[games.length - 1];
};

const cleanGames = (games: Game[]): Game[] => {
    return games.filter(game => !isEmpty(game.id));
};

const saveGameToLocalStorage = (game: Game, games: Game[]) => {
  // Remove games that don't have a valid id 
  const cleanedGames = cleanGames(games);
  
  // Check if game with same ID already exists
  const hasDuplicate = cleanedGames.some(existingGame => existingGame.id === game.id);
  
  // Only add the game if it's not already in the cleaned games
  if (!hasDuplicate && !isEmpty(game.id)) {
    cleanedGames.push(game);
  }

  localStorage.setItem('games', JSON.stringify(cleanedGames));
}

const GameContext = createContext({
  currentGame: getInitialState(),
  setCurrentGame: (game: Game) => {},
  games: [] as Game[],
  addGame: (game: Game) => {},
  updateGame: (game: Game) => {},
  deleteGame: (id: string) => {}
});

export const GameContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [currentGame, setCurrentGame] = useState<Game>(getInitialState());
  const [games, setGames] = useState<Game[]>(() => {
    const gamesStr = localStorage.getItem('games');
    return gamesStr ? JSON.parse(gamesStr) : [currentGame];
  });

  const addGame = (game: Game) => {
    const updatedGames = [...games, game];
    setGames(updatedGames);
    setCurrentGame(game);
    saveGameToLocalStorage(game, updatedGames);
  };

  const updateGame = (updatedGame: Game) => {
    const updatedGames = games.map(game => 
      game.id === updatedGame.id ? updatedGame : game
    );
    setGames(updatedGames);
    setCurrentGame(updatedGame);
    saveGameToLocalStorage(updatedGame, updatedGames);
  };

  const deleteGame = (id: string) => {
    const updatedGames = games.filter(game => game.id !== id);
    setGames(updatedGames);
    if (currentGame.id === id) {
      setCurrentGame(updatedGames[updatedGames.length - 1]);
    }
    saveGameToLocalStorage(currentGame, updatedGames);
  };

  const location = useLocation();

  // Update localStorage whenever current game changes
  useEffect(() => {
    const updatedGames = games.map(game =>
      game.id === currentGame.id ? currentGame : game
    );
    setGames(updatedGames);
    saveGameToLocalStorage(currentGame, updatedGames);
  }, [currentGame, location]);

  return (
    <GameContext.Provider value={{
      currentGame,
      setCurrentGame,
      games,
      addGame,
      updateGame,
      deleteGame
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => useContext(GameContext);

export default GameContextProvider;