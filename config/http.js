const { defaulted, processedOrDefault } = require('./helpers');

const DEFAULT_PORT = 3003;
const DEFAULT_TRUST_PROXY_HOPS = false;

module.exports = function generateHttpConfig({ PORT, TIMEOUT, TRUST_PROXY_HOPS }, config) {
  return Object.assign(config, {
    trustProxy: processedOrDefault(
      TRUST_PROXY_HOPS,
      (t) => parseInt(t, 10),
      DEFAULT_TRUST_PROXY_HOPS // eslint-disable-line comma-dangle
    ),
    port: defaulted(PORT, DEFAULT_PORT),
    timeout: processedOrDefault(
      TIMEOUT,
      (t) => parseInt(t, 10),
      10 * 60 * 1000 // eslint-disable-line comma-dangle
    ),
  });
};
