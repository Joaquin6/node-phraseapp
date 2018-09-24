const prefix = '/translations';

export default (parent) => {
  const child = {};

  child.store = function translationStore(data, callback) {
    return parent._postSigned(`${prefix}/store`, data, callback);
  };

  return child;
};
