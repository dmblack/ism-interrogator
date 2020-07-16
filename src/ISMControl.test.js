import React from 'react';
import { render } from '@testing-library/react';
import ISMControl from './ISMControl';

const exampleControl = JSON.parse('{"Guideline":["Guidelines for Cyber Security Roles"],"Section":["Chief Information Security Officer"],"Topic":["Cyber security leadership"],"Identifier":["0714"],"Revision":["4"],"Updated":["Sep-18"],"OFFICIAL":["Yes"],"PROTECTED":["Yes"],"SECRET":["Yes"],"TOP_SECRET":["Yes"],"Description":["A CISO is appointed to provide cyber security leadership for their organisation."]}');

test('renders, at very least, the text "Applicability:"', () => {
  const { getByText } = render(<ISMControl control={exampleControl}/>);
  const linkElement = getByText(/Applicability/i);
  expect(linkElement).toBeInTheDocument();
});
