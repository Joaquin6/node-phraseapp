import qs from 'querystring';

import { phraseappService } from '../services';

import createKeysController from './keys';
import createLocalesController from './locales';
import createSessionController from './sessions';
import createTranslationsController from './translations';

const injections = {
  qs,
  phraseappService,
};

export const keysController = createKeysController(injections);
export const localesController = createLocalesController(injections);
export const sessionsController = createSessionController(injections);
export const translationsController = createTranslationsController(injections);
