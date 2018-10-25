import {
  keysController,
  localesController,
  sessionsController,
  translationsController,
} from './controllers';

export default class Phraseapp {
  constructor(opts) {
    if (!(this instanceof Phraseapp)) {
      return new Phraseapp(opts);
    }
    if (typeof opts !== 'object') {
      throw new TypeError('opts must be an object');
    }
    if (!opts.token) {
      throw new TypeError('opts.token is required');
    }

    this.keys = keysController;
    this.locales = localesController;
    this.sessions = sessionsController;
    this.translations = translationsController;
  }
}
