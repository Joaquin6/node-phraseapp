const prefix = '/translations';

export default function createTranslationsController({ phraseappService }) {
  return {
    store(data, callback) {
      return phraseappService.postSigned(`${prefix}/store`, data, callback);
    },
  };
}
