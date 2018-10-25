const prefix = '/sessions';

export default function createSessionController({ phraseappService }) {
  return {
    post(data, callback) {
      return phraseappService.post(prefix, data, callback);
    },

    delete(data, callback) {
      return phraseappService.deleteWToken(prefix, data, callback);
    },

    checkLogin(callback) {
      return phraseappService.getWToken('/auth/check_login', callback);
    },
  };
}
