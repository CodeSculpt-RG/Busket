const path = require('path');

// Minimal Metro config that maps 'react-dom' imports to a local stub on native.
module.exports = {
  resolver: {
    extraNodeModules: {
      'react-dom': path.resolve(__dirname, 'react-dom-stub.js'),
    },
  },
};
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
