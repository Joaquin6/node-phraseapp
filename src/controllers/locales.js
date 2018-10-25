const prefix = '/locales';

export default function createLocalesController({ phraseappService }) {
  return {
    get(callback) {
      return phraseappService.getWToken(prefix, callback);
    },

    translationsGet(locale, format, callback) {
      return phraseappService.getWToken(`${prefix}/${locale}.${format}`, callback);
    },

    post(data, callback) {
      return phraseappService.postWToken(prefix, { locale: data }, callback);
    },

    makeDefault(locale) {
      return phraseappService.putWToken(`${prefix}/${locale}/make_default`);
    },
  };
}
