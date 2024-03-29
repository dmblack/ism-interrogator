import React from 'react';
import { render } from '@testing-library/react';
import ISMControl from './ISMControl';

const exampleControl = JSON.parse(
  '{"Guideline": "Guidelines for Cyber Security Roles", "Section": "Chief Information Security Officer", "Topic": "Providing cyber security leadership and guidance", "Identifier": "0714", "Revision": "5", "Updated": "Oct-20", "OFFICIAL": "Yes", "PROTECTED": "Yes", "SECRET": "Yes", "TOP_SECRET": "Yes", "Description": "A CISO is appointed to provide cyber security leadership and guidance for their organisation.", "SHA256": "6a93f2943f4995ab491556802dd47022c4092f9cd92024d3dd2be49295c59a7d"}'
);

describe('Ensures render of ISM Control...', () => {
  test('contains the ISM Control Identifier', () => {
    const { getByText } = render(<ISMControl key={exampleControl.Identifier} control={exampleControl} />);
    const linkElement = getByText(/0714/i);
    expect(linkElement).toBeInTheDocument();
  });
})
