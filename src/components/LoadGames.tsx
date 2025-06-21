import { useNavigate } from 'react-router-dom';
import PrimaryButton from './PrimaryButton';
import { useGameContext, Game, gameTypes } from '../contexts/GameContext';
import { isEmpty } from '../utils/Utils';

function LoadGames() {
const navigate = useNavigate();
  const { games, currentGame, setCurrentGame, deleteGame } = useGameContext();

  const handleGameClick = (game: Game) => {
    console.log(`${game.gameType} game with title"${game.title} and id ${game.id} selected...`);
    setCurrentGame(game);
  };

  const handleHomeClick = () => {
    navigate('/');
  }

  const handleDeleteClick = () => {
    deleteGame(currentGame.id);
  }

  const handleLoadClick = () => {
    switch (currentGame.gameType) {
    case gameTypes[0]: // Simple Scoresheet
    case gameTypes[1]: // Progressive Rook
      if (isEmpty(currentGame.settings))
      {
        navigate('prog-settings');
      }
      else
      {
        navigate('/prog-scoresheet');
      }       
      break;
    case gameTypes[2]: // Mahjong
      if (isEmpty(currentGame.settings))
      {
        navigate('mahjong-settings-players');
      }
      else
      {
        navigate('/mahjong-scoresheet');
      }  
      break;
    }
  }
  
  return (
    <div className='container'>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h1 className="title">Select a game</h1>
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => handleGameClick(game)}
            className='list-button'
            aria-pressed={currentGame.id === game.id}>
            {game.gameType} - {game.title}
          </button>
        ))}
      </div>
      <label>
        <div>
          <PrimaryButton onClick={handleLoadClick}>
            Load
          </PrimaryButton>
        </div>
      </label>
      <label>
        <div>
          <PrimaryButton onClick={handleDeleteClick}>
            Delete
          </PrimaryButton>
        </div>
      </label>
      <label>
        <div style={{marginTop: 20}}>
          <a className='link' onClick={handleHomeClick}>Home</a>
        </div>
      </label>
    </div>
  );
}

export default LoadGames;