import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/9 start : 10:00 end : 10:30/i);
  expect(linkElement).toBeInTheDocument();
});
