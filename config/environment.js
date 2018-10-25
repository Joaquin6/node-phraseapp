const { defaulted } = require('./helpers');

const DEFAULT_NODE_ENV = 'development';

module.exports = function generateEnvironmentConfig({ NODE_ENV }, config) {
  const env = defaulted(NODE_ENV, DEFAULT_NODE_ENV);
  const isProduction = env === 'production';

  return Object.assign(config, {
    env,
    isProduction,
  });
};