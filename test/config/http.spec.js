import generateHttpConfig from '../../config/http';

describe('config http', () => {
  const { config } = defaultServiceInjections();
  const httpConfig = {
    PORT: 3030,
    TIMEOUT: 1000,
    TRUST_PROXY_HOPS: false,
  };

  let mockedHTTPConfig;

  beforeEach(() => {
    mockedHTTPConfig = generateHttpConfig(httpConfig, config);
  });

  it('should return http config with the assigned `trustProxy`, `port` and `timeout` keys', () => {
    expect(mockedHTTPConfig).to.have.any.keys('trustProxy', 'port', 'timeout');
  });

  describe('port', () => {
    it('should return processed port', () => {
      expect(mockedHTTPConfig.port).equal(3030);
    });

    it('should return default port', () => {
      httpConfig.PORT = undefined;
      mockedHTTPConfig = generateHttpConfig(httpConfig, config);
      expect(mockedHTTPConfig.port).equal(3003);
    });
  });

  describe('timeout', () => {
    it('should return processed timeout', () => {
      expect(mockedHTTPConfig.timeout).equal(1000);
    });

    it('should return default timeout', () => {
      httpConfig.TIMEOUT = undefined;
      mockedHTTPConfig = generateHttpConfig(httpConfig, config);
      expect(mockedHTTPConfig.timeout).equal(10 * 60 * 1000);
    });
  });
});
