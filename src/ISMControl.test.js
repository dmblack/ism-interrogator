import React from 'react';
import { render } from '@testing-library/react';
import ISMControl from './ISMControl';

test('renders learn react link', () => {
  const { getByText } = render(<ISMControl />);
  const linkElement = getByText(/ISM Control/i);
  expect(linkElement).toBeInTheDocument();
});
