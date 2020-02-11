import React from 'react';
import { render, getByPlaceholderText } from '@testing-library/react';
import App from './App';

test('renders Click to send button', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Click to send/i);
  expect(linkElement).toBeInTheDocument();
});
