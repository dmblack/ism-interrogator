// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

/**
 * We currently fake our scrollTo behavior, to 
 * pass tests. This will be properly tested in future versions.
 */
window.scrollTo = jest.fn();