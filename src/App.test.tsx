import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the app', () => {
  render(<App />);
  const heading = screen.getByText(/ScoreKeep/i);
  expect(heading).toBeInTheDocument();
});
