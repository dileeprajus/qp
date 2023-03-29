# generator-react-webpack

[![Coverage Status](https://coveralls.io/repos/github/react-webpack-generators/generator-react-webpack/badge.svg?branch=master)](https://coveralls.io/github/react-webpack-generators/generator-react-webpack?branch=master) [![Join the chat at https://gitter.im/newtriks/generator-react-webpack](https://badges.gitter.im/newtriks/generator-react-webpack.svg)](https://gitter.im/newtriks/generator-react-webpack?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Build Status](https://secure.travis-ci.org/react-webpack-generators/generator-react-webpack.png?branch=master)](https://travis-ci.org/react-webpack-generators/generator-react-webpack) ![Amount of Downloads per month](https://img.shields.io/npm/dm/generator-react-webpack.svg "Amount of Downloads") ![Dependency Tracker](https://img.shields.io/david/react-webpack-generators/generator-react-webpack.svg "Dependency Tracker") ![Dependency Tracker](https://img.shields.io/david/dev/react-webpack-generators/generator-react-webpack.svg "Dependency Tracker") ![Node Version](https://img.shields.io/node/v/generator-react-webpack.svg "Node Version")

> Yeoman generator for [ReactJS](http://facebook.github.io/react/) - lets you quickly set up a project including karma test runner and [Webpack](http://webpack.github.io/) module system.

# About
Generator-React-Webpack will help you build new React projects using modern technologies.

Out of the box it comes with support for:
- Webpack
- ES2015 via Babel-Loader
- Different supported style languages (sass, scss, less, stylus)
- Style transformations via PostCSS
- Automatic code linting via esLint
- Ability to unit test components via Karma and Mocha/Chai

## Changes since version 2.0
This generator is written in ES2015. This means it is ___not compatible with node.js versions before 4.0___.

It also does __NOT__ include support for Flux-Frameworks anymore. Instead, we will use it as a base for other generators to build upon. This will make the base generator easier to use and update.

If you are interested, feel free to write your own generator and use generator-react-webpack as a base (via composition).

If you have built a generator using generator-react-webpack, tell us and we will add a link to our README.

## Generators that extend generator-react-webpack
- [Generator-React-Webpack-Alt](https://github.com/weblogixx/generator-react-webpack-alt) (Adds ability to create actions, stores and sources for [alt.js](http://alt.js.org))
- [Generator-React-Webpack-Redux](https://github.com/stylesuxx/generator-react-webpack-redux) (Adds ability to create actions and reducers for [Redux](https://github.com/rackt/redux))

---

## Installation
```bash
# Make sure both is installed globally
npm install -g yo
npm install -g generator-react-webpack
```

## Setting up projects
```bash
# Create a new directory, and `cd` into it:
mkdir my-new-project && cd my-new-project

# Run the generator
yo react-webpack
```

Please make sure to edit your newly generated `package.json` file to set description, author information and the like.

## Generating new components
```bash
# After setup of course :)
# cd my-new-project
yo react-webpack:component my/namespaced/components/name
```

The above command will create a new component, as well as its stylesheet and a basic testcase.

## Generating new stateless functional components
```
yo react-webpack:component my/namespaced/components/name --stateless
```
## Usage
The following commands are available in your project:
```bash
# Start for development
npm start # or
npm run serve

# Start the dev-server with the dist version
npm run serve:dist

# Just build the dist version and copy static files
npm run dist

# Run unit tests
npm test

# Auto-run unit tests on file changes
npm run test:watch

# Lint all files in src (also automatically done AFTER tests are run)
npm run lint

# Clean up the dist directory
npm run clean

# Just copy the static assets
npm run copy










## Deployment Steps
1. Make proper and safe changes and run ```webpack``` which will create dist directory.
2. Upload all the file to [CDN](https://fabula.signin.aws.amazon.com/console) Credentials to upload are provided via email.
3. Change **<TWX-APP-KEY>** in template in client side (For the first time.)
``` <!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>cdee_ui</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <script>
    const SERVER_APP_KEY = "<SERVER-KEY>";
    const SERVER_BASE_URL = "<SERVERURL>";
    const BACKEND = "Thingworx";
    const BACKEND = "Thingworx";
    let ieGlobalVariable = {};
  </script>
<script type="text/javascript" src="style.js"></script><script type="text/javascript" src="src.js"></script></body>
</html>
```

Sample Changes
---

## Development Steps

#### Please run below command to avoid putting app_key accidentally and commit.
```git update-index --assume-unchanged ./src/master-template.ejs```

#### If you want to change any code in ***master-template.ejs*** run the below command commit changes and run the above command after push. (avoid putting raw key)
```git update-index --no-assume-unchanged ./src/master-template.ejs```