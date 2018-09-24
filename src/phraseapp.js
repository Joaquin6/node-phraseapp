import request from 'request';

export default class Phraseapp {
  constructor(opts) {
    if (!(this instanceof Phraseapp)) {
      return new Phraseapp(opts);
    }
    if (typeof opts !== 'object') {
      throw new TypeError('opts [object] is required');
    }
    if (!opts.token) {
      throw new TypeError('opts.token is required');
    }

    Object.defineProperties(this, {
      apiPath: {
        value: opts.apiPath || 'https://phraseapp.com/api/v1',
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
          pointer.auth_token = opts.token;
          return cOpts;
        },
      },
      signedOpts: {
        value(cOpts, url, cb) {
          if (!opts.email) {
            throw new TypeError('opts.email is required');
          }
          if (!opts.password) {
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

          if (opts.user_token) {
            pointer.auth_token = opts.user_token;
            pointer.project_auth_token = opts.token;
            setImmediate(cb, null, cOpts);
            return;
          }

          this.sessions.post({
            email: opts.email,
            password: opts.password,
          }, (err, data) => {
            if (err) {
              return cb(err);
            }

            opts.user_token = data.auth_token;
            pointer.auth_token = opts.user_token;
            pointer.project_auth_token = opts.token;

            cb(null, cOpts);
          });
        },
      },
      opts: {
        value(cOpts, url) {
          cOpts.uri = this._getUrl(url);
          return cOpts;
        },
      },
    });

    this.sessions = require('./sessions')(this);
    this.locales = require('./locales')(this);
    this.keys = require('./keys')(this);
    this.translations = require('./translations')(this);
  }

  _getUrl(url) {
    return this.apiPath + url;
  }

  _getWToken(url, callback) {
    return this._requestWToken({ method: 'GET' }, url, callback);
  }

  _getSigned(url, callback) {
    return this._requestSigned({ method: 'GET' }, url, callback);
  }

  _get(url, callback) {
    return this._request(this.opts({ method: 'GET' }, url), callback);
  }

  _postWToken(url, data, callback) {
    return this._requestWToken({ method: 'POST', form: data }, url, callback);
  }

  _postSigned(url, data, callback) {
    return this._requestSigned({ method: 'POST', form: data }, url, callback);
  }

  _post(url, data, callback) {
    return this._request(this.opts({ method: 'POST', form: data }, url), callback);
  }

  _putWToken(url, data, callback) {
    return this._requestWToken({ method: 'PUT', form: data }, url, callback);
  }

  _putSigned(url, data, callback) {
    return this._requestSigned({ method: 'PUT', form: data }, url, callback);
  }

  _put(url, data, callback) {
    return this._request(this.opts({ method: 'PUT', form: data }, url), callback);
  }

  _patchWToken(url, data, callback) {
    return this._requestWToken({ method: 'PATCH', form: data }, url, callback);
  }

  _patchSigned(url, data, callback) {
    return this._requestSigned({ method: 'PATCH', form: data }, url, callback);
  }

  _patch(url, data, callback) {
    return this._request(this.opts({ method: 'PATCH', form: data }, url), callback);
  }

  _deleteWToken(url, callback) {
    return this._requestWToken({ method: 'DELETE' }, url, callback);
  }

  _deleteSigned(url, callback) {
    return this._requestSigned({ method: 'DELETE' }, url, callback);
  }

  _delete(url, callback) {
    return this._request(this.opts({ method: 'DELETE' }, url), callback);
  }

  _requestWToken(opts, url, callback) {
    return this._request(this.tokenOpts(opts, url), callback);
  }

  _requestSigned(opts, url, callback) {
    const self = this;
    self.signedOpts(opts, url, (err, opts) => {
      if (err) {
        callback(err);
        return;
      }
      self._request(opts, callback);
    });
  }

  _request(opts, callback) {
    if (!callback) { // No callback so return pipe
      return request(opts);
    }

    request(opts, (error, response, body) => {
      if (error) {
        callback(error);
        return;
      }
      if (response.statusCode < 200 || response.statusCode >= 300) {
        const err = new Error('Non 200 response');
        err.statusCode = response.statusCode;
        err.message = body;
        callback(err, body);
        return;
      }
      if (typeof body !== 'string' || (
        response.headers['content-type'].indexOf('application/json') === -1
                && response.headers['content-type'].indexOf('text/json') === -1)) {
        callback(null, body);
        return;
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
  }
}
