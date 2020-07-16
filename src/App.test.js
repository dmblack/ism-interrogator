import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('Renders search form.', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Description/i);
  expect(linkElement).toBeInTheDocument();
});
