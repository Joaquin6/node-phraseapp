const prefix = '/locales';

export default (parent) => {
  const child = {};

  child.get = function localesGet(callback) {
    return parent._getWToken(prefix, callback);
  };

  child.translationsGet = function localeTranslationsGet(locale, format, callback) {
    return parent._getWToken(`${prefix}/${locale}.${format}`, callback);
  };

  child.post = function localePost(data, callback) {
    return parent._postWToken(prefix, { locale: data }, callback);
  };

  child.makeDefault = function localeMakeDefault(locale) {
    return parent._putWToken(`${prefix}/${locale}/make_default`);
  };

  return child;
};
