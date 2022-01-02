import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

describe('Ensures App Renders...', () => {
  describe('Ensures Search...', () => {
    test('Is rendered.', () => {
      const app = render( <MemoryRouter><App /></MemoryRouter>);
      const searchTitle = app.container.querySelector('#search');
      expect(searchTitle).toBeInTheDocument();
    });
    
    test('has a description query.', () => {
      const app = render( <MemoryRouter><App /></MemoryRouter>);
      const descriptionElement = app.container.querySelector('#description');
      expect(descriptionElement).toBeInTheDocument();
    });
    
    test('has a guideline query.', () => {
      const app = render( <MemoryRouter><App /></MemoryRouter>);
      const searchElement = app.container.querySelector('#guideline');
      expect(searchElement).toBeInTheDocument();
    });
    
    test('has an identifier query.', () => {
      const app = render( <MemoryRouter><App /></MemoryRouter>);
      const searchElement = app.container.querySelector('#identifier');
      expect(searchElement).toBeInTheDocument();
    });
  })
})
  