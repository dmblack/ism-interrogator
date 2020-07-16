import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('Renders some search text.', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Search/i);
  expect(linkElement).toBeInTheDocument();
});
