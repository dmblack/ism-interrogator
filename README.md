# ISM-INTERROGATOR

A simple tool used to search (interrogate) the ISM Controls released by 
cyber.gov.au.

The deployed version of the tool can be found here;

https://dmblack.github.io/ism-interrogator/

# License

The ISM Controls leveraged in this project are released by cyber.gov.au;
https://www.cyber.gov.au/acsc/copyright

All other components of this project are MIT licensed.

# Contributing

## Opening Statement

All contributions to the project are welcome, however should follow
reasonable community guidelines.

Ideally; contributions are made to independent branches, pulled into
development, then pulled into master.

Ideally; contributions consist of end-to-end tests, following exiting
examples (which will soon be improved).

Deployment will be an automated byproduct of such workflow in the near
future.

## Getting Started (Development)

## Generating the latest ISM

The ISM is digested from src/ISM.json, which can be generated from the
partner project https://github.com/dmblack/ism-xml-to-ism-json

Refer to that project for usage, and simply copy the artefact to ./src/.

## Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

# Attribution

The ISM itself is released with the following considerations; © Commonwealth of Australia 2020. For More Information: https://www.cyber.gov.au/acsc/copyright