const prefix = '/projects';

export default function createProjectController({ phraseappService }) {
  return {
    getCurrent(data, callback) {
      return phraseappService.getWToken(`${prefix}/current`, callback);
    },
  };
}
