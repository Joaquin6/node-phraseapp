const prefix = '/keys';

export default function createKeysController({ phraseappService, qs }) {
  return {
    get(callback) {
      return phraseappService.getWToken(prefix, callback);
    },

    post(data, callback) {
      return phraseappService.postSigned(prefix, { key: data }, callback);
    },

    upload(data, callback) {
      return phraseappService.postSigned(`${prefix}/upload`, data, callback);
    },

    patch(id, data, callback) {
      return phraseappService.patchSigned(`${prefix}/${id}`, { key: data }, callback);
    },

    delete(id, callback) {
      return phraseappService.deleteSigned(`${prefix}/${id}`, callback);
    },

    deleteMultiple(ids, callback) {
      const signedPath = `${prefix}/destroy_multiple?${qs.stringify(ids)}`;
      return phraseappService.deleteSigned(signedPath, callback);
    },

    getUntranslated(callback) {
      return phraseappService.getWToken(`${prefix}/untranslated`, callback);
    },

    postTags(data, callback) {
      return phraseappService.postSigned(`${prefix}/tag`, data, callback);
    },

    getTranslation(key, callback) {
      return phraseappService.getWToken(`${prefix}/translate?key=${key}`, callback);
    },
  };
}
