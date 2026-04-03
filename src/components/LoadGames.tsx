import { useNavigate } from 'react-router-dom';
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
    // Parse settings from current game if they exist
    if (!isEmpty(currentGame.settings)) {
      try {
        JSON.parse(currentGame.settings); // validate JSON

        switch (currentGame.gameType) {
          case gameTypes[0]: // Basic Scoresheet
            navigate('/basic-scoresheet');
            break;
            
          case gameTypes[1]: // Progressive Rook
            navigate('/prog-scoresheet');
            break;
            
          case gameTypes[2]: // Mahjong
            navigate('/mahjong-scoresheet');
            break;
        }
      } catch (error) {
        console.error('Error parsing settings:', error);
        // If parsing fails, navigate to settings page
        navigateToSettingsPage();
      }
    } else {
      // No settings exist, navigate to settings page
      navigateToSettingsPage();
    }
  }

  const navigateToSettingsPage = () => {
    switch (currentGame.gameType) {
      case gameTypes[0]: // Basic Scoresheet
        navigate('basic-settings');
        break;
      case gameTypes[1]: // Progressive Rook
        navigate('prog-settings');
        break;
      case gameTypes[2]: // Mahjong
        navigate('mahjong-settings-players');
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
              {game.gameType} - {game.title} - {game.id && (
              <>
                {' '}
                <span style={{ fontSize: '0.85em', color: '#bbb' }}>
                  {(() => {
                    // If your game.id is a timestamp or starts with one, parse it:
                    const timestamp = Number(game.id.split('_')[0]);
                    if (!isNaN(timestamp)) {
                      const date = new Date(timestamp);
                      return date.toLocaleDateString();
                    }
                    return '';
                  })()}
                </span>
              </>
            )}
          </button>
        ))}
      </div>
      <label>
        <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
          <button
            style={{ flex: 1 }}
            className="primary-button"
            onClick={handleLoadClick}>
            Load
          </button>
          <button
            style={{ flex: 1 }}
            className="danger-button"
            onClick={handleDeleteClick}>
            Delete
          </button>
        </div>
      </label>
      <label>
        <div style={{marginTop: 10}}>
          <button className='link' onClick={handleHomeClick}>Home</button>
        </div>
      </label>
    </div>
  );
}

export default LoadGames;