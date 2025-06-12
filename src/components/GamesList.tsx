type Game = {
  title: string;
  // add other properties if needed
};

interface GamesListProps {
  games: Game[];
}

function GamesList({ games }: GamesListProps) {
  const handleClick = (game: Game) => {
    console.log(`Game with title ${game.title} clicked`);
  };
  return (
    <ul>
      {games.map((game) => (
        <li key={game.title} onClick={() => handleClick(game)}>
          {game.title}
        </li>
      ))}
    </ul>
  );
}

export default GamesList;