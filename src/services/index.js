import httpRequest from 'request';

import createPhraseappService from './phraseapp';

import config from '../../config';

const injections = {
  config,
  httpRequest,
};

export const phraseappService = createPhraseappService(injections);

export default {
  phraseappService,
};
