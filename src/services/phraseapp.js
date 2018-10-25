export default function createPhraseappService({ config, httpRequest }) {
  const service = {
    getUrl(url) {
      return config.apiPath + url;
    },

    getWToken(url, callback) {
      return this.requestWToken({ method: 'GET' }, url, callback);
    },

    getSigned(url, callback) {
      return this.requestSigned({ method: 'GET' }, url, callback);
    },

    get(url, callback) {
      return this.request(this.opts({ method: 'GET' }, url), callback);
    },

    postWToken(url, data, callback) {
      return this.requestWToken({ method: 'POST', form: data }, url, callback);
    },

    postSigned(url, data, callback) {
      return this.requestSigned({ method: 'POST', form: data }, url, callback);
    },

    post(url, data, callback) {
      return this.request(this.opts({ method: 'POST', form: data }, url), callback);
    },

    putWToken(url, data, callback) {
      return this.requestWToken({ method: 'PUT', form: data }, url, callback);
    },

    putSigned(url, data, callback) {
      return this.requestSigned({ method: 'PUT', form: data }, url, callback);
    },

    put(url, data, callback) {
      return this.request(this.opts({ method: 'PUT', form: data }, url), callback);
    },

    patchWToken(url, data, callback) {
      return this.requestWToken({ method: 'PATCH', form: data }, url, callback);
    },

    patchSigned(url, data, callback) {
      return this.requestSigned({ method: 'PATCH', form: data }, url, callback);
    },

    patch(url, data, callback) {
      return this.request(this.opts({ method: 'PATCH', form: data }, url), callback);
    },

    deleteWToken(url, callback) {
      return this.requestWToken({ method: 'DELETE' }, url, callback);
    },

    deleteSigned(url, callback) {
      return this.requestSigned({ method: 'DELETE' }, url, callback);
    },

    delete(url, callback) {
      return this.request(this.opts({ method: 'DELETE' }, url), callback);
    },

    requestWToken(opts, url, callback) {
      return this.request(this.tokenOpts(opts, url), callback);
    },

    requestSigned(opts, url, callback) {
      this.signedOpts(opts, url, (err, opts) => (err ? callback(err)
        : this.request(opts, callback)));
    },

    request(opts, callback) {
      if (!callback) { // No callback so return pipe
        return httpRequest(opts);
      }

      httpRequest(opts, (error, response, body) => {
        if (error) {
          return callback(error);
        }
        if (response.statusCode < 200 || response.statusCode >= 300) {
          const err = new Error('Non 200 response');
          err.statusCode = response.statusCode;
          err.message = body;
          return callback(err, body);
        }
        if (typeof body !== 'string' || (
          response.headers['content-type'].indexOf('application/json') === -1
          && response.headers['content-type'].indexOf('text/json') === -1)) {
          return callback(null, body);
        }

        let parseErr = null;
        let content = false;

        try {
          content = JSON.parse(body);
          if (content.content && content.mimetype === 'application/json') {
            content = JSON.parse(content.content);
          }
        } catch (e) {
          parseErr = new Error(`Malformed JSON response on ${opts.uri}`);
          content = body;
        }

        callback(parseErr, content);
      });
    },
  };

  Object.defineProperties(service, {
    apiPath: {
      value: config.apiPath || 'https://api.phraseapp.com/api/',
    },
    apiVersion: {
      value: config.apiVersion || 'v2',
    },
    tokenOpts: {
      value(cOpts, url) {
        cOpts = this.opts(cOpts, url);

        let pointer;
        if (cOpts.method === 'GET' || cOpts.method === 'DELETE') {
          cOpts.qs = cOpts.qs || {};
          pointer = cOpts.qs;
        } else {
          cOpts.form = cOpts.form || {};
          pointer = cOpts.form;
        }
        pointer.auth_token = config.token;
        return cOpts;
      },
    },
    signedOpts: {
      value(cOpts, url, cb) {
        if (!config.email) {
          throw new TypeError('opts.email is required');
        }
        if (!config.password) {
          throw new TypeError('opts.password is required');
        }

        cOpts = this.opts(cOpts, url);
        let pointer;

        if (cOpts.method === 'GET' || cOpts.method === 'DELETE') {
          cOpts.qs = cOpts.qs || {};
          pointer = cOpts.qs;
        } else {
          cOpts.form = cOpts.form || {};
          pointer = cOpts.form;
        }

        if (config.user_token) {
          pointer.auth_token = config.user_token;
          pointer.project_auth_token = config.token;
          setImmediate(cb, null, cOpts);
          return;
        }

        this.sessions.post({
          email: config.email,
          password: config.password,
        }, (err, data) => {
          if (err) {
            return cb(err);
          }

          config.user_token = data.auth_token;
          pointer.auth_token = config.user_token;
          pointer.project_auth_token = config.token;

          cb(null, cOpts);
        });
      },
    },
    opts: {
      value(cOpts, url) {
        cOpts.uri = this.getUrl(url);
        return cOpts;
      },
    },
  });

  return service;
}
