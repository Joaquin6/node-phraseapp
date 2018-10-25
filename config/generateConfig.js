const generateConfig = (env) => [
  './environment',
  './services',
  './http',
]
  .map((file) => require(file)) // eslint-disable-line
  .reduce((config, configurator) => configurator(env, config), {});

module.exports = generateConfig;