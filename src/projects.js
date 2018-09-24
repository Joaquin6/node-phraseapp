const prefix = '/projects';

export default (parent) => {
  const child = {};

  child.getCurrent = function getCurrent(data, callback) {
    return parent._getWToken(`${prefix}/current`, callback);
  };

  return child;
};
