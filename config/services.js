const { defaulted } = require('./helpers');

const DEFAULT_INGEST_SERVER_URL = 'http://localhost:3103';

module.exports = function generateHttpConfig({ INGEST_SERVER_URL }, config) {
  return Object.assign(config, {
    ingestServerUrl: defaulted(INGEST_SERVER_URL, DEFAULT_INGEST_SERVER_URL),
  });
};